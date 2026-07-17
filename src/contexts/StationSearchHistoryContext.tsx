import { isAuthError, useAuth } from "@/contexts/AuthContext";
import {
  MAX_STATION_HISTORY,
  StationHistoryMap,
  StationTarget,
  StationTrainType,
  StoredStationHistory,
} from "@/models/station-history";
import { callUserApi } from "@/services/userApi";
import {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

/** 支援同步的車種；順序固定供 flatten / 遍歷使用（BUS_STOP 只收藏不記歷史，不在此列） */
const TRAIN_TYPES: StationTrainType[] = ["TR", "BUS"];
const MAX_PER_TYPE = MAX_STATION_HISTORY;
const SYNC_DEBOUNCE_MS = 800;

/** localStorage：整張歷史 map 一個 key；另一個 key 記「上次完成同步的 uid」 */
const STORAGE_KEY = "stationSearchHistoryMap";
const SYNCED_UID_KEY = "stationSearchHistorySyncedUid";

function emptyMap(): StationHistoryMap {
  return { TR: [], BUS: [], BUS_STOP: [] };
}

/** 合法單筆：targetId / targetName 皆為非空字串 */
function isValidEntry(x: unknown): boolean {
  return (
    !!x &&
    typeof x === "object" &&
    typeof (x as any).targetId === "string" &&
    !!(x as any).targetId &&
    typeof (x as any).targetName === "string" &&
    !!(x as any).targetName
  );
}

/** 讀取 meta（相容前端 `meta` 與後端線格式 `targetMeta`）；無效回 undefined */
function readMeta(x: any): string | undefined {
  const v = typeof x.meta === "string" ? x.meta : x.targetMeta;
  return typeof v === "string" && v ? v : undefined;
}

/** dedupe（同 targetId 取較新）→ 依 lastUsedAt 由新到舊 → 取前 MAX_PER_TYPE 筆 */
function sortTrim(items: StoredStationHistory[]): StoredStationHistory[] {
  const map = new Map<string, StoredStationHistory>();
  for (const it of items) {
    const ex = map.get(it.targetId);
    if (!ex || it.lastUsedAt > ex.lastUsedAt) map.set(it.targetId, it);
  }
  return [...map.values()]
    .sort((a, b) => b.lastUsedAt - a.lastUsedAt)
    .slice(0, MAX_PER_TYPE);
}

/** 清洗任意來源（localStorage / server）成乾淨 StationHistoryMap */
function sanitizeMap(raw: unknown): StationHistoryMap {
  const m = emptyMap();
  if (!raw || typeof raw !== "object") return m;
  for (const t of TRAIN_TYPES) {
    const arr = (raw as any)[t];
    if (!Array.isArray(arr)) continue;
    m[t] = sortTrim(
      arr
        .filter(
          (x: any) =>
            isValidEntry(x) &&
            typeof x.lastUsedAt === "number" &&
            Number.isFinite(x.lastUsedAt),
        )
        .map((x: any) => ({
          targetId: String(x.targetId),
          targetName: String(x.targetName),
          meta: readMeta(x),
          lastUsedAt: Number(x.lastUsedAt),
        })),
    );
  }
  return m;
}

function readLocal(): StationHistoryMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? sanitizeMap(JSON.parse(raw)) : emptyMap();
  } catch {
    return emptyMap();
  }
}

function writeLocal(map: StationHistoryMap): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

/** 攤平成後端 PUT 需要的 items（meta → 線格式 targetMeta） */
function flattenItems(map: StationHistoryMap) {
  const items: Array<{
    trainType: StationTrainType;
    targetId: string;
    targetName: string;
    targetMeta: string | null;
    lastUsedAt: number;
  }> = [];
  for (const t of TRAIN_TYPES) {
    for (const it of map[t]) {
      items.push({
        trainType: t,
        targetId: it.targetId,
        targetName: it.targetName,
        targetMeta: it.meta ?? null,
        lastUsedAt: it.lastUsedAt,
      });
    }
  }
  return items;
}

/** GET /api/users/station-search-history */
async function fetchServer(): Promise<StationHistoryMap> {
  return sanitizeMap(
    await callUserApi({
      url: "/api/users/station-search-history",
      method: "GET",
    }),
  );
}

/** PUT /api/users/station-search-history（批次 upsert，回 canonical map） */
async function pushServer(
  map: StationHistoryMap,
  signal?: AbortSignal,
): Promise<StationHistoryMap> {
  return sanitizeMap(
    await callUserApi({
      url: "/api/users/station-search-history",
      method: "PUT",
      body: { items: flattenItems(map) },
      signal,
    }),
  );
}

/** DELETE /api/users/station-search-history?trainType=...（清單一車種，回 canonical map） */
async function deleteServer(t: StationTrainType): Promise<StationHistoryMap> {
  return sanitizeMap(
    await callUserApi({
      url: `/api/users/station-search-history?trainType=${t}`,
      method: "DELETE",
    }),
  );
}

export interface StationSearchHistoryContextValue {
  history: StationHistoryMap;
  /** 新增一筆歷史（會打時間戳、dedupe、trim；登入則排程同步） */
  saveHistory: (trainType: StationTrainType, target: StationTarget) => void;
  /** 清除某車種歷史（登入則同步刪 server） */
  clearHistory: (trainType: StationTrainType) => void;
}

export const StationSearchHistoryContext =
  createContext<StationSearchHistoryContextValue>({
    history: emptyMap(),
    saveHistory: () => {},
    clearHistory: () => {},
  });

/**
 * 通用單點查詢歷史 Provider（台鐵單站 / 公車路線共用）。
 * 同步紀律與 OD SearchHistoryContext 一致：debounce push + opSeq/abort 守衛 + union-once 登入策略。
 */
export function StationSearchHistoryProvider({ children }) {
  const { user, loading: authLoading, notifySessionExpired } = useAuth();
  const [history, setHistory] = useState<StationHistoryMap>(emptyMap());
  const [hydrated, setHydrated] = useState(false);
  const historyRef = useRef(history);
  historyRef.current = history;

  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const opSeqRef = useRef<number>(0);
  const pushAbortRef = useRef<AbortController | null>(null);

  /** 客戶端水合：從 localStorage 載入 */
  useEffect(() => {
    setHistory(readLocal());
    setHydrated(true);
  }, []);

  const adoptServerMap = useCallback((canonical: StationHistoryMap) => {
    writeLocal(canonical);
    historyRef.current = canonical;
    setHistory(canonical);
  }, []);

  /** 推送整組 map；opSeq + abort 守衛避免舊回應覆蓋新狀態。回傳是否確實落地 server */
  const runPush = useCallback(
    async (map: StationHistoryMap): Promise<boolean> => {
      const seq = ++opSeqRef.current;
      pushAbortRef.current?.abort();
      const controller = new AbortController();
      pushAbortRef.current = controller;
      try {
        const canonical = await pushServer(map, controller.signal);
        if (seq === opSeqRef.current) adoptServerMap(canonical);
        return true;
      } catch (err) {
        if (controller.signal.aborted) return false;
        if (isAuthError(err)) {
          notifySessionExpired();
          return false;
        }
        console.error("同步單點查詢歷史到 server 失敗", err);
        return false;
      } finally {
        if (pushAbortRef.current === controller) pushAbortRef.current = null;
      }
    },
    [adoptServerMap, notifySessionExpired],
  );

  /** 排程推送（debounced） */
  const schedulePush = useCallback(
    (map: StationHistoryMap) => {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
      syncTimerRef.current = setTimeout(() => {
        syncTimerRef.current = null;
        void runPush(map);
      }, SYNC_DEBOUNCE_MS);
    },
    [runPush],
  );

  /** 立即刪除某車種（清除是明確操作，不走 debounce），先取消在途 PUT 與 debounce 避免回寫復活 */
  const fireDelete = useCallback(
    (trainType: StationTrainType) => {
      if (syncTimerRef.current) {
        clearTimeout(syncTimerRef.current);
        syncTimerRef.current = null;
      }
      pushAbortRef.current?.abort();
      const seq = ++opSeqRef.current;
      (async () => {
        try {
          const canonical = await deleteServer(trainType);
          if (seq !== opSeqRef.current) return;
          adoptServerMap(canonical);
        } catch (err) {
          if (isAuthError(err)) {
            notifySessionExpired();
            return;
          }
          console.error("清除單點查詢歷史失敗", err);
        }
      })();
    },
    [adoptServerMap, notifySessionExpired],
  );

  /** 新增一筆歷史：dedupe + trim 後寫本地 + state；登入則排程推送 */
  const saveHistory = useCallback(
    (trainType: StationTrainType, target: StationTarget) => {
      const entry: StoredStationHistory = {
        targetId: target.targetId,
        targetName: target.targetName,
        meta: target.meta,
        lastUsedAt: Date.now(),
      };
      const nextType = sortTrim([entry, ...historyRef.current[trainType]]);
      const next = { ...historyRef.current, [trainType]: nextType };
      historyRef.current = next;
      setHistory(next);
      writeLocal(next);
      if (user) schedulePush(next);
    },
    [user, schedulePush],
  );

  /** 清除某車種歷史：寫本地空 + state；登入則同步刪 server */
  const clearHistory = useCallback(
    (trainType: StationTrainType) => {
      const next = { ...historyRef.current, [trainType]: [] };
      historyRef.current = next;
      setHistory(next);
      writeLocal(next);
      if (user) fireDelete(trainType);
    },
    [user, fireDelete],
  );

  /**
   * 登入同步：union 一次 → 之後一律以 server 為準（canonical）。
   * 理由同 OD：純 union 無法表達刪除，會讓別台已清除的紀錄在 refresh 時復活。
   */
  useEffect(() => {
    if (!hydrated || authLoading) return;
    if (!user) return; // 未登入 → 純本地模式

    let cancelled = false;
    const uid = user.uid;
    (async () => {
      try {
        const seq = ++opSeqRef.current;
        const remote = await fetchServer();
        if (cancelled || seq !== opSeqRef.current) return;

        if (localStorage.getItem(SYNCED_UID_KEY) === null) {
          const local = readLocal();
          const merged = emptyMap();
          for (const t of TRAIN_TYPES) {
            merged[t] = sortTrim([...remote[t], ...local[t]]);
          }
          adoptServerMap(merged);
          const pushed = await runPush(merged);
          if (pushed && !cancelled) localStorage.setItem(SYNCED_UID_KEY, uid);
        } else {
          if (cancelled || seq !== opSeqRef.current) return;
          adoptServerMap(remote);
          localStorage.setItem(SYNCED_UID_KEY, uid);
        }
      } catch (err) {
        if (isAuthError(err)) {
          notifySessionExpired();
          return;
        }
        console.error("初次同步單點查詢歷史失敗", err);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, hydrated, authLoading, notifySessionExpired]);

  /** 跨分頁同步：其他 tab 改了 key → 重讀更新 state（不回推 server） */
  useEffect(() => {
    if (!hydrated) return;
    const handler = (e: StorageEvent) => {
      if (e.key !== null && e.key !== STORAGE_KEY) return;
      const next = readLocal();
      historyRef.current = next;
      setHistory(next);
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [hydrated]);

  /** 卸載清理：清 timer、abort 在途 PUT、讓晚到回應 seq 守衛失效 */
  useEffect(() => {
    return () => {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
      pushAbortRef.current?.abort();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      opSeqRef.current++;
    };
  }, []);

  return (
    <StationSearchHistoryContext.Provider
      value={{ history, saveHistory, clearHistory }}
    >
      {children}
    </StationSearchHistoryContext.Provider>
  );
}
