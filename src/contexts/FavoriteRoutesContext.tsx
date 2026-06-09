import { isAuthError, useAuth } from "@/contexts/AuthContext";
import {
  AddFavoriteResult,
  FavoriteRoute,
  FavoriteRouteMap,
  MAX_FAVORITES,
} from "@/models/favorite-routes";
import { TrainType } from "@/models/history";
import { callUserApi } from "@/services/userApi";
import {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const TRAIN_TYPES: TrainType[] = ["TR", "THSR", "TYMC"];
const SYNC_DEBOUNCE_MS = 800;

/** localStorage：整張收藏 map 一個 key；另一個 key 記「上次完成同步的 uid」 */
const STORAGE_KEY = "favoriteRoutesMap";
const SYNCED_UID_KEY = "favoriteRoutesSyncedUid";

function emptyMap(): FavoriteRouteMap {
  return { TR: [], THSR: [], TYMC: [] };
}

function isValidRoute(x: unknown): boolean {
  return (
    !!x &&
    typeof x === "object" &&
    typeof (x as any).startStationId === "string" &&
    typeof (x as any).endStationId === "string" &&
    !!(x as any).startStationId &&
    !!(x as any).endStationId
  );
}

/** dedupe（同 OD 取較新 createdAt）→ createdAt 由新到舊 → 取前 MAX_FAVORITES */
function sortTrim(items: FavoriteRoute[]): FavoriteRoute[] {
  const map = new Map<string, FavoriteRoute>();
  for (const it of items) {
    const k = `${it.startStationId}|${it.endStationId}`;
    const ex = map.get(k);
    if (!ex || it.createdAt > ex.createdAt) map.set(k, it);
  }
  return [...map.values()]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, MAX_FAVORITES);
}

/** 清洗任意來源（localStorage / server）成乾淨 FavoriteRouteMap */
function sanitizeMap(raw: unknown): FavoriteRouteMap {
  const m = emptyMap();
  if (!raw || typeof raw !== "object") return m;
  const now = Date.now();
  for (const t of TRAIN_TYPES) {
    const arr = (raw as any)[t];
    if (!Array.isArray(arr)) continue;
    m[t] = sortTrim(
      arr.filter(isValidRoute).map((x: any) => ({
        startStationId: String(x.startStationId),
        endStationId: String(x.endStationId),
        createdAt:
          typeof x.createdAt === "number" && Number.isFinite(x.createdAt)
            ? Number(x.createdAt)
            : now,
      })),
    );
  }
  return m;
}

function readLocal(): FavoriteRouteMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? sanitizeMap(JSON.parse(raw)) : emptyMap();
  } catch {
    return emptyMap();
  }
}

function writeLocal(map: FavoriteRouteMap): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

function flattenItems(map: FavoriteRouteMap) {
  const items: Array<FavoriteRoute & { trainType: TrainType }> = [];
  for (const t of TRAIN_TYPES) {
    for (const it of map[t]) items.push({ trainType: t, ...it });
  }
  return items;
}

/** GET /api/users/favorite-routes */
async function fetchServer(): Promise<FavoriteRouteMap> {
  return sanitizeMap(
    await callUserApi({ url: "/api/users/favorite-routes", method: "GET" }),
  );
}

/** PUT /api/users/favorite-routes（整組 replace，回 canonical map） */
async function pushServer(
  map: FavoriteRouteMap,
  signal?: AbortSignal,
): Promise<FavoriteRouteMap> {
  return sanitizeMap(
    await callUserApi({
      url: "/api/users/favorite-routes",
      method: "PUT",
      body: { items: flattenItems(map) },
      signal,
    }),
  );
}

export interface FavoriteRoutesContextValue {
  favorites: FavoriteRouteMap;
  /** 加入收藏（已達上限回 "limit"，否則 "added"；已收藏視為 idempotent "added"） */
  addFavorite: (
    trainType: TrainType,
    startStationId: string,
    endStationId: string,
  ) => AddFavoriteResult;
  /** 移除收藏 */
  removeFavorite: (
    trainType: TrainType,
    startStationId: string,
    endStationId: string,
  ) => void;
  /** 該 OD 是否已收藏 */
  isFavorite: (
    trainType: TrainType,
    startStationId: string,
    endStationId: string,
  ) => boolean;
}

export const FavoriteRoutesContext = createContext<FavoriteRoutesContextValue>({
  favorites: emptyMap(),
  addFavorite: () => "added",
  removeFavorite: () => {},
  isFavorite: () => false,
});

export function FavoriteRoutesProvider({ children }) {
  const { user, loading: authLoading, notifySessionExpired } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteRouteMap>(emptyMap());
  const [hydrated, setHydrated] = useState(false);
  const favRef = useRef(favorites);
  favRef.current = favorites;

  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const opSeqRef = useRef<number>(0);
  const pushAbortRef = useRef<AbortController | null>(null);

  /** 客戶端水合：從 localStorage 載入 */
  useEffect(() => {
    setFavorites(readLocal());
    setHydrated(true);
  }, []);

  const adoptServerMap = useCallback((canonical: FavoriteRouteMap) => {
    writeLocal(canonical);
    favRef.current = canonical;
    setFavorites(canonical);
  }, []);

  /** 推送整組 map（replace）；opSeq + abort 守衛避免舊回應覆蓋新狀態 */
  const runPush = useCallback(
    async (map: FavoriteRouteMap): Promise<boolean> => {
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
        console.error("同步常用路線到 server 失敗", err);
        return false;
      } finally {
        if (pushAbortRef.current === controller) pushAbortRef.current = null;
      }
    },
    [adoptServerMap, notifySessionExpired],
  );

  /** 排程推送（debounced）；先 abort 在途 PUT + 提升 opSeq，避免舊回應晚到復活已移除的收藏 */
  const schedulePush = useCallback(
    (map: FavoriteRouteMap) => {
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

  /** 寫入本地 + state；登入則排程同步 */
  const commit = useCallback(
    (next: FavoriteRouteMap) => {
      favRef.current = next;
      setFavorites(next);
      writeLocal(next);
      if (user) schedulePush(next);
    },
    [user, schedulePush],
  );

  const addFavorite = useCallback(
    (
      trainType: TrainType,
      startStationId: string,
      endStationId: string,
    ): AddFavoriteResult => {
      const list = favRef.current[trainType];
      if (
        list.some(
          (x) =>
            x.startStationId === startStationId &&
            x.endStationId === endStationId,
        )
      ) {
        return "added"; // 已收藏，idempotent
      }
      if (list.length >= MAX_FAVORITES) return "limit";
      const nextType = sortTrim([
        { startStationId, endStationId, createdAt: Date.now() },
        ...list,
      ]);
      commit({ ...favRef.current, [trainType]: nextType });
      return "added";
    },
    [commit],
  );

  const removeFavorite = useCallback(
    (trainType: TrainType, startStationId: string, endStationId: string) => {
      const nextType = favRef.current[trainType].filter(
        (x) =>
          !(
            x.startStationId === startStationId &&
            x.endStationId === endStationId
          ),
      );
      commit({ ...favRef.current, [trainType]: nextType });
    },
    [commit],
  );

  const isFavorite = useCallback(
    (trainType: TrainType, startStationId: string, endStationId: string) =>
      favorites[trainType].some(
        (x) =>
          x.startStationId === startStationId &&
          x.endStationId === endStationId,
      ),
    [favorites],
  );

  /**
   * 登入狀態同步：
   *   - 未登入：收藏為會員功能，清掉本地（資料仍在 server，重新登入還原）。
   *   - 未同步過（匿名殘留 / 上次未清乾淨）：與 server union 一次後上傳（replace）。
   *   - 已同步過 / 切換帳號：直接採 server canonical。
   */
  useEffect(() => {
    if (!hydrated || authLoading) return;
    if (!user) {
      // 登出 / 未登入：清本地收藏（僅在確有資料時，避免無謂重繪）
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
        console.error("初次同步常用路線失敗", err);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, hydrated, authLoading, notifySessionExpired]);

  /** 跨分頁同步：其他 tab 改了收藏 key → 重讀更新 state（不回推 server） */
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
    <FavoriteRoutesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </FavoriteRoutesContext.Provider>
  );
}
