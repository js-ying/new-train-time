import { isAuthError, useAuth } from "@/contexts/AuthContext";
import {
  HistoryInquiry,
  HistoryMap,
  StoredHistoryInquiry,
  TrainType,
} from "@/models/history";
import { callUserApi } from "@/services/userApi";
import {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

/** 支援同步的車種；順序固定供 flatten / 遍歷使用 */
const TRAIN_TYPES: TrainType[] = ["TR", "THSR", "TYMC"];

/** 各車種保留筆數上限（與後端一致） */
const MAX_PER_TYPE = 5;

/** 推送到 server 的 debounce 延遲（毫秒，對齊 SettingContext） */
const SYNC_DEBOUNCE_MS = 800;

/** 車種 → localStorage key（沿用既有 `${page}HistoryList` 命名，保留 legacy 資料） */
const keyOf = (t: TrainType): string => `${t.toLowerCase()}HistoryList`;
const STORAGE_KEYS = new Set<string>(TRAIN_TYPES.map(keyOf));
const typeOfStorageKey = (k: string): TrainType | null =>
  TRAIN_TYPES.find((t) => keyOf(t) === k) ?? null;

/** 產生空的歷史 map */
function emptyMap(): HistoryMap {
  return { TR: [], THSR: [], TYMC: [] };
}

/** 判斷物件是否為合法 OD（起迄站皆為非空字串）；回 boolean 不做型別窄化 */
function isValidOd(x: unknown): boolean {
  return (
    !!x &&
    typeof x === "object" &&
    typeof (x as any).startStationId === "string" &&
    typeof (x as any).endStationId === "string" &&
    !!(x as any).startStationId &&
    !!(x as any).endStationId
  );
}

/**
 * dedupe（同 OD 取較新）→ 依 lastUsedAt 由新到舊排序 → 取前 MAX_PER_TYPE 筆
 */
function sortTrim(items: StoredHistoryInquiry[]): StoredHistoryInquiry[] {
  const map = new Map<string, StoredHistoryInquiry>();
  for (const it of items) {
    const k = `${it.startStationId}|${it.endStationId}`;
    const ex = map.get(k);
    if (!ex || it.lastUsedAt > ex.lastUsedAt) map.set(k, it);
  }
  return [...map.values()]
    .sort((a, b) => b.lastUsedAt - a.lastUsedAt)
    .slice(0, MAX_PER_TYPE);
}

/**
 * 讀單一車種的本地歷史；相容兩種格式：
 *   - 新格式：含 lastUsedAt，直接採用
 *   - legacy：僅 {start,end}、oldest-first → 反轉成 newest-first 並補遞減時間戳保序
 */
function readLocalType(t: TrainType): StoredHistoryInquiry[] {
  try {
    const raw = localStorage.getItem(keyOf(t));
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];

    const valid = arr.filter(isValidOd);
    const hasStamp =
      valid.length > 0 &&
      valid.every(
        (x: any) =>
          typeof x.lastUsedAt === "number" && Number.isFinite(x.lastUsedAt),
      );

    const now = Date.now();
    const items: StoredHistoryInquiry[] = hasStamp
      ? valid.map((x: any) => ({
          startStationId: String(x.startStationId),
          endStationId: String(x.endStationId),
          lastUsedAt: Number(x.lastUsedAt),
        }))
      : valid.reverse().map((x: any, i: number) => ({
          startStationId: String(x.startStationId),
          endStationId: String(x.endStationId),
          lastUsedAt: now - i,
        }));

    return sortTrim(items);
  } catch {
    return [];
  }
}

/** 讀出三車種的本地歷史 */
function readAllLocal(): HistoryMap {
  const m = emptyMap();
  for (const t of TRAIN_TYPES) m[t] = readLocalType(t);
  return m;
}

/** 寫入單一車種的本地歷史（newest-first） */
function writeLocalType(t: TrainType, items: StoredHistoryInquiry[]): void {
  localStorage.setItem(keyOf(t), JSON.stringify(items));
}

/** 整組寫回本地 */
function writeAllLocal(map: HistoryMap): void {
  for (const t of TRAIN_TYPES) writeLocalType(t, map[t]);
}

/** 將 server 回傳清洗成乾淨 HistoryMap（防後端殘留 / 髒資料污染 state） */
function sanitizeServerMap(raw: unknown): HistoryMap {
  const m = emptyMap();
  if (!raw || typeof raw !== "object") return m;
  for (const t of TRAIN_TYPES) {
    const arr = (raw as any)[t];
    if (!Array.isArray(arr)) continue;
    m[t] = sortTrim(
      arr
        .filter(
          (x: any) =>
            isValidOd(x) &&
            typeof x.lastUsedAt === "number" &&
            Number.isFinite(x.lastUsedAt),
        )
        .map((x: any) => ({
          startStationId: String(x.startStationId),
          endStationId: String(x.endStationId),
          lastUsedAt: Number(x.lastUsedAt),
        })),
    );
  }
  return m;
}

/** 把 HistoryMap 攤平成後端 PUT 需要的 items 陣列 */
function flattenItems(map: HistoryMap) {
  const items: Array<StoredHistoryInquiry & { trainType: TrainType }> = [];
  for (const t of TRAIN_TYPES) {
    for (const it of map[t]) items.push({ trainType: t, ...it });
  }
  return items;
}

/** GET /api/users/search-history */
async function fetchServerHistory(): Promise<HistoryMap> {
  return sanitizeServerMap(
    await callUserApi({ url: "/api/users/search-history", method: "GET" }),
  );
}

/** PUT /api/users/search-history（批次 upsert，回 canonical map） */
async function pushServerHistory(map: HistoryMap): Promise<HistoryMap> {
  return sanitizeServerMap(
    await callUserApi({
      url: "/api/users/search-history",
      method: "PUT",
      body: { items: flattenItems(map) },
    }),
  );
}

/** DELETE /api/users/search-history?trainType=...（清單一車種，回 canonical map） */
async function deleteServerHistory(t: TrainType): Promise<HistoryMap> {
  return sanitizeServerMap(
    await callUserApi({
      url: `/api/users/search-history?trainType=${t}`,
      method: "DELETE",
    }),
  );
}

export interface SearchHistoryContextValue {
  history: HistoryMap;
  /** 新增一筆歷史（會打時間戳、dedupe、trim；登入則排程同步） */
  saveHistory: (trainType: TrainType, inquiry: HistoryInquiry) => void;
  /** 清除某車種歷史（登入則同步刪 server） */
  clearHistory: (trainType: TrainType) => void;
}

export const SearchHistoryContext = createContext<SearchHistoryContextValue>({
  history: emptyMap(),
  saveHistory: () => {},
  clearHistory: () => {},
});

export function SearchHistoryProvider({ children }) {
  const { user, loading: authLoading, notifySessionExpired } = useAuth();
  const [history, setHistory] = useState<HistoryMap>(emptyMap());
  const [hydrated, setHydrated] = useState(false);

  /** debounce 計時器 */
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** 從 server 回灌時抑制再次推送，避免循環 */
  const suppressPushRef = useRef<boolean>(false);

  /**
   * 客戶端水合：從 localStorage 載入三車種歷史
   */
  useEffect(() => {
    setHistory(readAllLocal());
    setHydrated(true);
  }, []);

  /**
   * 將 server 回傳的 canonical map 收斂回本地與 state（抑制再次推送）
   */
  const adoptServerMap = useCallback((canonical: HistoryMap) => {
    suppressPushRef.current = true;
    writeAllLocal(canonical);
    setHistory(canonical);
    suppressPushRef.current = false;
  }, []);

  /**
   * 排程推送整組 map 到 server（debounced）
   * 401 → notifySessionExpired；其他錯誤靜默 log（同步失敗不打斷操作）
   */
  const schedulePush = useCallback(
    (map: HistoryMap) => {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
      syncTimerRef.current = setTimeout(async () => {
        try {
          adoptServerMap(await pushServerHistory(map));
        } catch (err) {
          if (isAuthError(err)) {
            notifySessionExpired();
            return;
          }
          console.error("同步歷史查詢到 server 失敗", err);
        }
      }, SYNC_DEBOUNCE_MS);
    },
    [adoptServerMap, notifySessionExpired],
  );

  /**
   * 立即刪除某車種（清除是明確操作，不走 debounce）
   */
  const fireDelete = useCallback(
    (trainType: TrainType) => {
      if (syncTimerRef.current) {
        clearTimeout(syncTimerRef.current);
        syncTimerRef.current = null;
      }
      (async () => {
        try {
          adoptServerMap(await deleteServerHistory(trainType));
        } catch (err) {
          if (isAuthError(err)) {
            notifySessionExpired();
            return;
          }
          console.error("清除歷史查詢失敗", err);
        }
      })();
    },
    [adoptServerMap, notifySessionExpired],
  );

  /**
   * 新增一筆歷史：打時間戳 + dedupe + trim → 寫本地 + state；登入則排程推送
   * 未登入：只更新本地（沿用原行為），登入後由 merge 帶上雲端
   */
  const saveHistory = useCallback(
    (trainType: TrainType, inquiry: HistoryInquiry) => {
      setHistory((prev) => {
        const entry: StoredHistoryInquiry = {
          startStationId: inquiry.startStationId,
          endStationId: inquiry.endStationId,
          lastUsedAt: Date.now(),
        };
        const nextType = sortTrim([entry, ...prev[trainType]]);
        const next = { ...prev, [trainType]: nextType };
        writeLocalType(trainType, nextType);
        if (user && !suppressPushRef.current) schedulePush(next);
        return next;
      });
    },
    [user, schedulePush],
  );

  /**
   * 清除某車種歷史：寫本地空 + state；登入則同步刪 server
   */
  const clearHistory = useCallback(
    (trainType: TrainType) => {
      setHistory((prev) => {
        const next = { ...prev, [trainType]: [] };
        writeLocalType(trainType, []);
        if (user) fireDelete(trainType);
        return next;
      });
    },
    [user, fireDelete],
  );

  /**
   * 登入狀態變化：per-row union 初次同步
   *   1. 讀本地三車種 + GET 雲端
   *   2. 按 OD union（lastUsedAt 取較新），各車種取最新 5 筆
   *   3. 寫回本地 + state，再 PUT 取代 server，採用回傳的 canonical
   * 與 settings「雲端覆蓋本地」不同：歷史本地資料是真實使用記錄，做 union 不丟。
   */
  useEffect(() => {
    if (!hydrated || authLoading) return;
    if (!user) return; // 未登入 → 純本地模式

    let cancelled = false;
    (async () => {
      try {
        const remote = await fetchServerHistory();
        if (cancelled) return;

        const local = readAllLocal();
        const merged = emptyMap();
        for (const t of TRAIN_TYPES) {
          merged[t] = sortTrim([...remote[t], ...local[t]]);
        }

        adoptServerMap(merged);

        const canonical = await pushServerHistory(merged);
        if (cancelled) return;
        adoptServerMap(canonical);
      } catch (err) {
        if (isAuthError(err)) {
          notifySessionExpired();
          return;
        }
        console.error("初次同步歷史查詢失敗", err);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, hydrated, authLoading, notifySessionExpired]);

  /**
   * 跨分頁同步：其他 tab 寫入歷史 key 時，重讀對應車種更新 state（不回推 server）
   */
  useEffect(() => {
    if (!hydrated) return;
    const handler = (e: StorageEvent) => {
      if (e.key === null) {
        // localStorage 被整個清空
        setHistory(emptyMap());
        return;
      }
      if (!STORAGE_KEYS.has(e.key)) return;
      const t = typeOfStorageKey(e.key);
      if (!t) return;
      const items = readLocalType(t);
      setHistory((prev) => ({ ...prev, [t]: items }));
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [hydrated]);

  /** 卸載時清除排程中的 push */
  useEffect(() => {
    return () => {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    };
  }, []);

  return (
    <SearchHistoryContext.Provider
      value={{ history, saveHistory, clearHistory }}
    >
      {children}
    </SearchHistoryContext.Provider>
  );
}
