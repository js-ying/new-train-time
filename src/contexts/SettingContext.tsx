import { isAuthError, useAuth } from "@/contexts/AuthContext";
import { callUserApi } from "@/services/userApi";
import { useTheme } from "next-themes";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

/** 色彩主題；"system" 代表跟隨作業系統偏好 */
export type ThemeMode = "light" | "dark" | "system";

export interface SettingParams {
  showTrTrainNote: boolean;
  showThsrTrainNote: boolean;
  autoRedirectLastUsedPage: boolean;
  mobileUseTrDirectBooking: boolean;
  mobileUseThsrDirectBooking: boolean;
  /** 是否顯示首頁熱門路線快查區塊 */
  showPopularRoutes: boolean;
  /** 色彩主題（light / dark / system）*/
  theme: ThemeMode;
}

export const defaultSetting: SettingParams = {
  showTrTrainNote: true,
  showThsrTrainNote: true,
  autoRedirectLastUsedPage: false,
  mobileUseTrDirectBooking: true,
  mobileUseThsrDirectBooking: true,
  /** 預設顯示熱門路線快查 */
  showPopularRoutes: true,
  /** 預設跟隨系統色彩偏好（對齊 next-themes 行為） */
  theme: "system",
};

/** localStorage 上存放「最後一次設定變更時間（毫秒）」的 key */
const UPDATED_AT_KEY = "settingsUpdatedAt";

/** 推送到 server 的 debounce 延遲（毫秒） */
const SYNC_DEBOUNCE_MS = 800;

/** 所有被同步的 localStorage key 集合（用於 storage event 過濾） */
const SYNCED_KEYS = new Set<string>(Object.keys(defaultSetting));

/**
 * 判斷字串是否為有效的 ThemeMode
 */
function isThemeMode(v: unknown): v is ThemeMode {
  return v === "light" || v === "dark" || v === "system";
}

/**
 * 將 localStorage 字串解析成對應欄位的值
 * theme 欄位為字串，其餘欄位為 boolean
 */
function parseStoredValue<K extends keyof SettingParams>(
  key: K,
  raw: string,
): SettingParams[K] {
  if (key === "theme") {
    return (isThemeMode(raw) ? raw : defaultSetting.theme) as SettingParams[K];
  }
  return (raw === "true") as SettingParams[K];
}

/**
 * 將設定值序列化成 localStorage 字串
 */
function serializeValue<K extends keyof SettingParams>(
  value: SettingParams[K],
): string {
  return String(value);
}

export const SettingContext = createContext<SettingParams>(null);
/** 更新單一設定項的函式：`(key, value) => void` */
export const SettingUpdateContext =
  createContext<
    <K extends keyof SettingParams>(key: K, value: SettingParams[K]) => void
  >(null);

/**
 * 從 localStorage 讀出設定快照（未存過的欄位補預設值，並回寫）
 */
function readLocalSettings(): SettingParams {
  const next: SettingParams = { ...defaultSetting };
  (Object.keys(defaultSetting) as (keyof SettingParams)[]).forEach((key) => {
    const raw = localStorage.getItem(key);
    if (raw === null) {
      localStorage.setItem(key, serializeValue(defaultSetting[key]));
      (next as any)[key] = defaultSetting[key];
    } else {
      (next as any)[key] = parseStoredValue(key, raw);
    }
  });
  return next;
}

/** 讀出本地 updatedAt；若無則回 0（代表從未在新機制下被修改） */
function readLocalUpdatedAt(): number {
  const raw = localStorage.getItem(UPDATED_AT_KEY);
  const n = raw ? Number(raw) : 0;
  return Number.isFinite(n) ? n : 0;
}

/** 將整組 settings 寫入 localStorage，並更新 updatedAt */
function writeLocalSettings(settings: SettingParams, updatedAt: number): void {
  (Object.keys(settings) as (keyof SettingParams)[]).forEach((k) => {
    localStorage.setItem(k, serializeValue(settings[k]));
  });
  localStorage.setItem(UPDATED_AT_KEY, String(updatedAt));
}

/**
 * 呼叫 BFF GET /api/users/settings
 * 失敗會拋 ApiError，呼叫端依 code 區分（401 → 觸發 notifySessionExpired）
 */
async function fetchServerSettings(): Promise<{
  settings: Partial<SettingParams> | null;
  updatedAt: number | null;
}> {
  return callUserApi({ url: "/api/users/settings", method: "GET" });
}

/** 呼叫 BFF PUT /api/users/settings */
async function pushServerSettings(
  settings: SettingParams,
  updatedAt: number,
): Promise<{
  applied: boolean;
  settings: Partial<SettingParams>;
  updatedAt: number;
}> {
  return callUserApi({
    url: "/api/users/settings",
    method: "PUT",
    body: { settings, updatedAt },
  });
}

/**
 * 將任意來源的 settings（可能只含部分欄位）與預設值合併成完整 SettingParams
 * 僅保留 SettingParams 所定義且型別正確的 key，避免後端殘留舊欄位污染 state
 */
function mergeWithDefault(partial: Partial<SettingParams> | null): SettingParams {
  const merged: SettingParams = { ...defaultSetting };
  if (!partial) return merged;
  (Object.keys(defaultSetting) as (keyof SettingParams)[]).forEach((key) => {
    const v = (partial as any)[key];
    if (key === "theme") {
      if (isThemeMode(v)) merged.theme = v;
    } else if (typeof v === "boolean") {
      (merged as any)[key] = v;
    }
  });
  return merged;
}

/**
 * 將 SettingContext 的 theme 狀態同步到 next-themes 並更新 PWA meta theme-color
 * - 使用者切換或 server 回灌 theme 變化時會經由這裡套用
 * - 同 tab 內的 next-themes 不會觸發 storage event，不會造成循環
 */
function ThemeSyncer() {
  const settings = useContext(SettingContext);
  const themeSetting = settings?.theme;
  const { theme: currentNextTheme, resolvedTheme, setTheme } = useTheme();

  // 同步 SettingContext.theme → next-themes
  useEffect(() => {
    if (!themeSetting) return;
    if (currentNextTheme === themeSetting) return;
    setTheme(themeSetting);
  }, [themeSetting, currentNextTheme, setTheme]);

  // 依 resolvedTheme 更新 PWA 工具列主題色
  useEffect(() => {
    if (!resolvedTheme) return;
    const metaColor = resolvedTheme === "light" ? "#FFFFFF" : "#212529";
    document
      .querySelector("meta[name='theme-color']")
      ?.setAttribute("content", metaColor);
  }, [resolvedTheme]);

  return null;
}

export function SettingProvider({ children }) {
  const { user, loading: authLoading, notifySessionExpired } = useAuth();
  const [settings, setSettings] = useState<SettingParams>(defaultSetting);
  /** 是否已完成 localStorage 初始水合 */
  const [hydrated, setHydrated] = useState(false);

  /** 本地最後更新時間（毫秒），用於 LWW 比較 */
  const updatedAtRef = useRef<number>(0);
  /** debounce 計時器 */
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** 避免從 server 回灌資料時又被推回 server */
  const suppressPushRef = useRef<boolean>(false);

  /**
   * 客戶端水合：從 localStorage 載入設定
   */
  useEffect(() => {
    const local = readLocalSettings();
    updatedAtRef.current = readLocalUpdatedAt();
    setSettings(local);
    setHydrated(true);
  }, []);

  /**
   * 實際推送到 server（debounced）
   * 401 類錯誤 → 呼叫 notifySessionExpired 強制登出 + 提示
   * 其他錯誤 → 靜默 log（同步失敗不該打斷使用者操作）
   */
  const schedulePush = useCallback(
    (next: SettingParams, nextUpdatedAt: number) => {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
      syncTimerRef.current = setTimeout(async () => {
        try {
          const result = await pushServerSettings(next, nextUpdatedAt);
          // 若 server 拒絕（server 有更新版本），改以 server 版本覆蓋本地
          if (!result.applied) {
            const merged = mergeWithDefault(result.settings);
            suppressPushRef.current = true;
            updatedAtRef.current = result.updatedAt;
            writeLocalSettings(merged, result.updatedAt);
            setSettings(merged);
            suppressPushRef.current = false;
          }
        } catch (err) {
          if (isAuthError(err)) {
            notifySessionExpired();
            return;
          }
          console.error("同步設定到 server 失敗", err);
        }
      }, SYNC_DEBOUNCE_MS);
    },
    [notifySessionExpired],
  );

  /**
   * 更新單一設定項：寫 localStorage + 更新 state + 排程推送 server
   * 已登入時才推到 server；未登入純本地
   */
  const setValue = useCallback(
    <K extends keyof SettingParams>(key: K, value: SettingParams[K]) => {
      setSettings((prev) => {
        const next = { ...prev, [key]: value };
        const now = Date.now();
        updatedAtRef.current = now;
        writeLocalSettings(next, now);
        if (!suppressPushRef.current && user) {
          schedulePush(next, now);
        }
        return next;
      });
    },
    [schedulePush, user],
  );

  /**
   * 登入狀態變化：拉 server 與本地做 LWW 合併
   * 401 類錯誤 → 觸發 notifySessionExpired；其他錯誤靜默 log
   */
  useEffect(() => {
    if (!hydrated || authLoading) return;
    if (!user) return; // 未登入 → 純本地模式

    let cancelled = false;
    (async () => {
      try {
        const remote = await fetchServerSettings();
        if (cancelled) return;

        const localUpdatedAt = updatedAtRef.current;
        const remoteUpdatedAt = remote.updatedAt ?? 0;

        if (remote.settings && remoteUpdatedAt > localUpdatedAt) {
          // server 較新 → 覆蓋本地
          const merged = mergeWithDefault(remote.settings);
          suppressPushRef.current = true;
          updatedAtRef.current = remoteUpdatedAt;
          writeLocalSettings(merged, remoteUpdatedAt);
          setSettings(merged);
          suppressPushRef.current = false;
        } else if (localUpdatedAt > remoteUpdatedAt) {
          // 本地較新（或 server 從未有資料）→ 推上去
          await pushServerSettings(settings, localUpdatedAt).catch((err) => {
            if (isAuthError(err)) {
              notifySessionExpired();
              return;
            }
            console.error("初次同步 push 失敗", err);
          });
        }
        // 雙邊相等時不做任何事
      } catch (err) {
        if (isAuthError(err)) {
          notifySessionExpired();
          return;
        }
        console.error("初次同步 server 設定失敗", err);
      }
    })();

    return () => {
      cancelled = true;
    };
    // settings 故意不列入 deps：只關心使用者切換時的同步，不關心 settings 本身的變化
    // （settings 變化已透過 setValue → schedulePush 處理）
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, hydrated, authLoading, notifySessionExpired]);

  /**
   * 跨分頁同步：任一 tab 寫入 localStorage 都會通知其他 tab
   */
  useEffect(() => {
    if (!hydrated) return;
    const handler = (e: StorageEvent) => {
      if (e.key === null) return; // localStorage 被整個清空
      if (e.key !== UPDATED_AT_KEY && !SYNCED_KEYS.has(e.key)) return;

      // 以 updatedAt 判斷是否真的有變化（next-themes 自行寫 theme 時不會動 updatedAt，不會誤觸）
      const incomingUpdatedAt = readLocalUpdatedAt();
      if (incomingUpdatedAt <= updatedAtRef.current) return;

      const next = readLocalSettings();
      suppressPushRef.current = true;
      updatedAtRef.current = incomingUpdatedAt;
      setSettings(next);
      suppressPushRef.current = false;
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [hydrated]);

  /**
   * 卸載時清除排程中的 push
   */
  useEffect(() => {
    return () => {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    };
  }, []);

  return (
    <SettingContext.Provider value={settings}>
      <SettingUpdateContext.Provider value={setValue}>
        {/* 必須等水合完成才掛載，避免以預設值 "system" 覆寫使用者已儲存的 theme */}
        {hydrated && <ThemeSyncer />}
        {children}
      </SettingUpdateContext.Provider>
    </SettingContext.Provider>
  );
}
