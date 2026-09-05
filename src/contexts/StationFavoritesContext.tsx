import { isAuthError, useAuth } from "@/contexts/AuthContext";
import { PREMIUM_MAX_PER_TYPE, maxPerType } from "@/models/membership";
import {
  AddStationFavoriteResult,
  StationFavorite,
  StationFavoriteMap,
} from "@/models/station-favorites";
import { StationTarget, StationTrainType } from "@/models/station-history";
import { callUserApi } from "@/services/userApi";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const TRAIN_TYPES: StationTrainType[] = ["TR", "BUS", "BUS_STOP"];
/** 本地保留筆數上限；取付費上限保底，新增判斷與對外顯示再依當下身分 */
const MAX_PER_TYPE = PREMIUM_MAX_PER_TYPE;
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

/**
 * dedupe（同 targetId 取較新 createdAt）→ 取前 max。
 * 陣列順序即顯示順序，故不重排；Map.set 覆蓋不改變首次出現的位置。
 */
function dedupeTrim(
  items: StationFavorite[],
  max: number = MAX_PER_TYPE,
): StationFavorite[] {
  const map = new Map<string, StationFavorite>();
  for (const it of items) {
    const ex = map.get(it.targetId);
    if (!ex || it.createdAt > ex.createdAt) map.set(it.targetId, it);
  }
  return [...map.values()].slice(0, max);
}

function sanitizeMap(raw: unknown): StationFavoriteMap {
  const m = emptyMap();
  if (!raw || typeof raw !== "object") return m;
  const now = Date.now();
  for (const t of TRAIN_TYPES) {
    const arr = (raw as any)[t];
    if (!Array.isArray(arr)) continue;
    m[t] = dedupeTrim(
      arr.filter(isValidEntry).map((x: any) => ({
        targetId: String(x.targetId),
        targetName: String(x.targetName),
        meta: readMeta(x),
        createdAt:
          typeof x.createdAt === "number" && Number.isFinite(x.createdAt)
            ? Number(x.createdAt)
            : now,
      })),
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
  /** 各車種收藏（已依當下會員身分截斷至 limit 筆） */
  favorites: StationFavoriteMap;
  /** 當下會員身分的各車種收藏上限 */
  limit: number;
  /** 加入收藏（已達上限回 "limit"，否則 "added"；已收藏視為 idempotent "added"） */
  addFavorite: (
    trainType: StationTrainType,
    target: StationTarget,
  ) => AddStationFavoriteResult;
  /** 移除收藏 */
  removeFavorite: (trainType: StationTrainType, targetId: string) => void;
  /** 該 target 是否已收藏 */
  isFavorite: (trainType: StationTrainType, targetId: string) => boolean;
  /** 重排該車種收藏；orderedIds 為 targetId 的新順序（僅涵蓋可見清單） */
  reorderFavorites: (trainType: StationTrainType, orderedIds: string[]) => void;
}

export const StationFavoritesContext =
  createContext<StationFavoritesContextValue>({
    favorites: emptyMap(),
    limit: maxPerType(false),
    addFavorite: () => "added",
    removeFavorite: () => {},
    isFavorite: () => false,
    reorderFavorites: () => {},
  });

/**
 * 通用單點收藏 Provider（台鐵單站 / 公車路線 / 公車站牌共用）。
 * 同步紀律與 OD FavoriteRoutesContext 一致：整組 replace + 登出清本地（會員功能）。
 */
export function StationFavoritesProvider({ children }) {
  const { user, profile, loading: authLoading, notifySessionExpired } = useAuth();
  const limit = maxPerType(!!profile?.isPremium);
  const [favorites, setFavorites] = useState<StationFavoriteMap>(emptyMap());
  const [hydrated, setHydrated] = useState(false);
  const favRef = useRef(favorites);
  favRef.current = favorites;

  /** 對外只給當下身分可用的筆數；本地仍保留至付費上限，續費即恢復 */
  const visibleFavorites = useMemo(() => {
    const m = emptyMap();
    for (const t of TRAIN_TYPES) m[t] = favorites[t].slice(0, limit);
    return m;
  }, [favorites, limit]);
  const visibleRef = useRef(visibleFavorites);
  visibleRef.current = visibleFavorites;

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
      // 以可見清單判定，與 isFavorite（愛心狀態）同一份依據
      const list = visibleRef.current[trainType];
      if (list.some((x) => x.targetId === target.targetId)) {
        return "added"; // 已收藏，idempotent
      }
      if (list.length >= limit) return "limit";
      const nextType = dedupeTrim([
        {
          targetId: target.targetId,
          targetName: target.targetName,
          meta: target.meta,
          createdAt: Date.now(),
        },
        ...list,
      ]);
      commit({ ...favRef.current, [trainType]: nextType });
      return "added";
    },
    [commit, limit],
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

  /** 以可見清單判定，確保「愛心實心」與「出現在常用清單」永遠一致 */
  const isFavorite = useCallback(
    (trainType: StationTrainType, targetId: string) =>
      visibleFavorites[trainType].some((x) => x.targetId === targetId),
    [visibleFavorites],
  );

  /**
   * 依 orderedIds 重排可見清單；未列到的（重排期間被別的分頁改動）依原順序補在尾端。
   * 超出當下上限、僅本地保留的隱藏筆維持在後段，續費後順序不變。
   */
  const reorderFavorites = useCallback(
    (trainType: StationTrainType, orderedIds: string[]) => {
      const visible = visibleRef.current[trainType];
      const byId = new Map(visible.map((x) => [x.targetId, x]));
      const next: StationFavorite[] = [];
      for (const id of orderedIds) {
        const it = byId.get(id);
        if (it) {
          next.push(it);
          byId.delete(id);
        }
      }
      next.push(...byId.values());
      const hidden = favRef.current[trainType].slice(visible.length);
      commit({ ...favRef.current, [trainType]: [...next, ...hidden] });
    },
    [commit],
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
            merged[t] = dedupeTrim([...remote[t], ...local[t]]);
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
      value={{
        favorites: visibleFavorites,
        limit,
        addFavorite,
        removeFavorite,
        isFavorite,
        reorderFavorites,
      }}
    >
      {children}
    </StationFavoritesContext.Provider>
  );
}
