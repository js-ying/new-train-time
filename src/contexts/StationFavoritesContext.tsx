import { isAuthError, useAuth } from "@/contexts/AuthContext";
import {
  AddStationFavoriteResult,
  maxStationFavorites,
  StationFavorite,
  StationFavoriteMap,
} from "@/models/station-favorites";
import { StationTarget, StationTrainType } from "@/models/station-history";
import { callUserApi } from "@/services/userApi";
import {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const TRAIN_TYPES: StationTrainType[] = ["TR", "BUS", "BUS_STOP"];
const SYNC_DEBOUNCE_MS = 800;

const STORAGE_KEY = "stationFavoritesMap";
const SYNCED_UID_KEY = "stationFavoritesSyncedUid";

function emptyMap(): StationFavoriteMap {
  return { TR: [], BUS: [], BUS_STOP: [] };
}

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

/** dedupe（同 targetId 取較新 createdAt）→ createdAt 由新到舊 → 取前 max（依車種上限） */
function sortTrim(items: StationFavorite[], max: number): StationFavorite[] {
  const map = new Map<string, StationFavorite>();
  for (const it of items) {
    const ex = map.get(it.targetId);
    if (!ex || it.createdAt > ex.createdAt) map.set(it.targetId, it);
  }
  return [...map.values()]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, max);
}

function sanitizeMap(raw: unknown): StationFavoriteMap {
  const m = emptyMap();
  if (!raw || typeof raw !== "object") return m;
  const now = Date.now();
  for (const t of TRAIN_TYPES) {
    const arr = (raw as any)[t];
    if (!Array.isArray(arr)) continue;
    m[t] = sortTrim(
      arr.filter(isValidEntry).map((x: any) => ({
        targetId: String(x.targetId),
        targetName: String(x.targetName),
        meta: readMeta(x),
        createdAt:
          typeof x.createdAt === "number" && Number.isFinite(x.createdAt)
            ? Number(x.createdAt)
            : now,
      })),
      maxStationFavorites(t),
    );
  }
  return m;
}

function readLocal(): StationFavoriteMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? sanitizeMap(JSON.parse(raw)) : emptyMap();
  } catch {
    return emptyMap();
  }
}

function writeLocal(map: StationFavoriteMap): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

/** 攤平成後端 PUT 需要的 items（meta → 線格式 targetMeta） */
function flattenItems(map: StationFavoriteMap) {
  const items: Array<{
    trainType: StationTrainType;
    targetId: string;
    targetName: string;
    targetMeta: string | null;
    createdAt: number;
  }> = [];
  for (const t of TRAIN_TYPES) {
    for (const it of map[t]) {
      items.push({
        trainType: t,
        targetId: it.targetId,
        targetName: it.targetName,
        targetMeta: it.meta ?? null,
        createdAt: it.createdAt,
      });
    }
  }
  return items;
}

/** GET /api/users/station-favorites */
async function fetchServer(): Promise<StationFavoriteMap> {
  return sanitizeMap(
    await callUserApi({ url: "/api/users/station-favorites", method: "GET" }),
  );
}

/** PUT /api/users/station-favorites（整組 replace，回 canonical map） */
async function pushServer(
  map: StationFavoriteMap,
  signal?: AbortSignal,
): Promise<StationFavoriteMap> {
  return sanitizeMap(
    await callUserApi({
      url: "/api/users/station-favorites",
      method: "PUT",
      body: { items: flattenItems(map) },
      signal,
    }),
  );
}

export interface StationFavoritesContextValue {
  favorites: StationFavoriteMap;
  /** 加入收藏（已達上限回 "limit"，否則 "added"；已收藏視為 idempotent "added"） */
  addFavorite: (
    trainType: StationTrainType,
    target: StationTarget,
  ) => AddStationFavoriteResult;
  /** 移除收藏 */
  removeFavorite: (trainType: StationTrainType, targetId: string) => void;
  /** 該 target 是否已收藏 */
  isFavorite: (trainType: StationTrainType, targetId: string) => boolean;
}

export const StationFavoritesContext =
  createContext<StationFavoritesContextValue>({
    favorites: emptyMap(),
    addFavorite: () => "added",
    removeFavorite: () => {},
    isFavorite: () => false,
  });

/**
 * 通用單點收藏 Provider（台鐵單站 / 公車路線 / 公車站牌共用）。
 * 同步紀律與 OD FavoriteRoutesContext 一致：整組 replace + 登出清本地（會員功能）。
 */
export function StationFavoritesProvider({ children }) {
  const { user, loading: authLoading, notifySessionExpired } = useAuth();
  const [favorites, setFavorites] = useState<StationFavoriteMap>(emptyMap());
  const [hydrated, setHydrated] = useState(false);
  const favRef = useRef(favorites);
  favRef.current = favorites;

  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const opSeqRef = useRef<number>(0);
  const pushAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setFavorites(readLocal());
    setHydrated(true);
  }, []);

  const adoptServerMap = useCallback((canonical: StationFavoriteMap) => {
    writeLocal(canonical);
    favRef.current = canonical;
    setFavorites(canonical);
  }, []);

  const runPush = useCallback(
    async (map: StationFavoriteMap): Promise<boolean> => {
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
        console.error("同步單點收藏到 server 失敗", err);
        return false;
      } finally {
        if (pushAbortRef.current === controller) pushAbortRef.current = null;
      }
    },
    [adoptServerMap, notifySessionExpired],
  );

  /** 排程推送（debounced）；先 abort 在途 PUT + 提升 opSeq，避免舊回應晚到復活已移除的收藏 */
  const schedulePush = useCallback(
    (map: StationFavoriteMap) => {
      pushAbortRef.current?.abort();
      opSeqRef.current++;
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
      syncTimerRef.current = setTimeout(() => {
        syncTimerRef.current = null;
        void runPush(map);
      }, SYNC_DEBOUNCE_MS);
    },
    [runPush],
  );

  const commit = useCallback(
    (next: StationFavoriteMap) => {
      favRef.current = next;
      setFavorites(next);
      writeLocal(next);
      if (user) schedulePush(next);
    },
    [user, schedulePush],
  );

  const addFavorite = useCallback(
    (
      trainType: StationTrainType,
      target: StationTarget,
    ): AddStationFavoriteResult => {
      const list = favRef.current[trainType];
      if (list.some((x) => x.targetId === target.targetId)) {
        return "added"; // 已收藏，idempotent
      }
      const max = maxStationFavorites(trainType);
      if (list.length >= max) return "limit";
      const nextType = sortTrim(
        [
          {
            targetId: target.targetId,
            targetName: target.targetName,
            meta: target.meta,
            createdAt: Date.now(),
          },
          ...list,
        ],
        max,
      );
      commit({ ...favRef.current, [trainType]: nextType });
      return "added";
    },
    [commit],
  );

  const removeFavorite = useCallback(
    (trainType: StationTrainType, targetId: string) => {
      const nextType = favRef.current[trainType].filter(
        (x) => x.targetId !== targetId,
      );
      commit({ ...favRef.current, [trainType]: nextType });
    },
    [commit],
  );

  const isFavorite = useCallback(
    (trainType: StationTrainType, targetId: string) =>
      favorites[trainType].some((x) => x.targetId === targetId),
    [favorites],
  );

  /**
   * 登入同步：
   *   - 未登入：收藏為會員功能，清掉本地（資料仍在 server，重新登入還原）。
   *   - 未同步過：與 server union 一次後上傳（replace）。
   *   - 已同步過 / 切換帳號：直接採 server canonical。
   */
  useEffect(() => {
    if (!hydrated || authLoading) return;
    if (!user) {
      if (TRAIN_TYPES.some((t) => favRef.current[t].length > 0)) {
        const empty = emptyMap();
        favRef.current = empty;
        setFavorites(empty);
        writeLocal(empty);
      }
      return;
    }

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
            merged[t] = sortTrim(
              [...remote[t], ...local[t]],
              maxStationFavorites(t),
            );
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
        console.error("初次同步單點收藏失敗", err);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, hydrated, authLoading, notifySessionExpired]);

  /** 跨分頁同步 */
  useEffect(() => {
    if (!hydrated) return;
    const handler = (e: StorageEvent) => {
      if (e.key !== null && e.key !== STORAGE_KEY) return;
      const next = readLocal();
      favRef.current = next;
      setFavorites(next);
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [hydrated]);

  /** 卸載清理 */
  useEffect(() => {
    return () => {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
      pushAbortRef.current?.abort();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      opSeqRef.current++;
    };
  }, []);

  return (
    <StationFavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </StationFavoritesContext.Provider>
  );
}
