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

/**
 * localStorage key：記錄此裝置「上次完成同步的帳號 uid」。
 * 用來區分三種登入同步情境：
 *   - 不存在（匿名期累積的本地紀錄）→ union 撈救一次後上傳
 *   - 等於當前 uid（本裝置 cache）→ 以 server 為準（canonical）
 *   - 不等於當前 uid（切換帳號）→ 丟棄前帳號本地，純取當前帳號 server
 */
const SYNCED_UID_KEY = "searchHistorySyncedUid";

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

/** PUT /api/users/search-history（批次 upsert，回 canonical map）；signal 供取消進行中的推送 */
async function pushServerHistory(
  map: HistoryMap,
  signal?: AbortSignal,
): Promise<HistoryMap> {
  return sanitizeServerMap(
    await callUserApi({
      url: "/api/users/search-history",
      method: "PUT",
      body: { items: flattenItems(map) },
      signal,
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
  /**
   * 單調遞增的「同步操作序號」：每個會動到 server 的操作（push / delete / 登入同步）
   * 在發動時取下一號；await 完成後只有「仍持有最新序號者」可 adopt，避免較舊的回應
   * 覆蓋較新操作的結果（例如進行中的 PUT 回應晚於後發的 DELETE 而把清除蓋回去）。
   */
  const opSeqRef = useRef<number>(0);
  /** 進行中 PUT 的 AbortController；清除 / 新一輪 push 時用來取消，避免被回寫復活 */
  const pushAbortRef = useRef<AbortController | null>(null);

  /**
   * 客戶端水合：從 localStorage 載入三車種歷史
   */
  useEffect(() => {
    setHistory(readAllLocal());
    setHydrated(true);
  }, []);

  /**
   * 將 server 回傳的 canonical map 收斂回本地與 state。
   * 純資料收斂，不會觸發 saveHistory，故無循環風險（不需抑制旗標）。
   */
  const adoptServerMap = useCallback((canonical: HistoryMap) => {
    writeAllLocal(canonical);
    setHistory(canonical);
  }, []);

  /**
   * 實際推送整組 map 到 server：
   *   - 取下一個操作序號、取消前一個進行中的 PUT
   *   - await 回來後若已非最新操作（被後發的 push/delete 取代）→ 丟棄結果不 adopt
   *   - 被取消（aborted）靜默；401 → notifySessionExpired；其他錯誤靜默 log
   * 回傳：PUT 是否成功落地 server（true）。被取消 / 401 / 其他錯誤皆回 false，
   * 供首次同步據此決定要不要標記 SYNCED_UID_KEY（避免上傳沒成功就鎖死同步模式）。
   */
  const runPush = useCallback(
    async (map: HistoryMap): Promise<boolean> => {
      const seq = ++opSeqRef.current;
      pushAbortRef.current?.abort();
      const controller = new AbortController();
      pushAbortRef.current = controller;
      try {
        const canonical = await pushServerHistory(map, controller.signal);
        if (seq === opSeqRef.current) adoptServerMap(canonical); // 仍為最新才 adopt
        return true; // PUT 已成功落地 server（不論是否仍為最新而 adopt）
      } catch (err) {
        if (controller.signal.aborted) return false; // 被新操作取消
        if (isAuthError(err)) {
          notifySessionExpired();
          return false;
        }
        console.error("同步歷史查詢到 server 失敗", err);
        return false;
      } finally {
        if (pushAbortRef.current === controller) pushAbortRef.current = null;
      }
    },
    [adoptServerMap, notifySessionExpired],
  );

  /**
   * 排程推送整組 map 到 server（debounced）；同步失敗不打斷操作
   */
  const schedulePush = useCallback(
    (map: HistoryMap) => {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
      syncTimerRef.current = setTimeout(() => {
        syncTimerRef.current = null;
        void runPush(map);
      }, SYNC_DEBOUNCE_MS);
    },
    [runPush],
  );

  /**
   * 立即刪除某車種（清除是明確操作，不走 debounce）。
   * 先取消尚未觸發的 debounce 與進行中的 PUT，並取下一個操作序號，
   * 確保清除不會被「比它早發、卻晚回來」的 PUT 回寫復活。
   */
  const fireDelete = useCallback(
    (trainType: TrainType) => {
      if (syncTimerRef.current) {
        clearTimeout(syncTimerRef.current);
        syncTimerRef.current = null;
      }
      pushAbortRef.current?.abort();
      const seq = ++opSeqRef.current;
      (async () => {
        try {
          const canonical = await deleteServerHistory(trainType);
          if (seq !== opSeqRef.current) return; // 已有更新操作，放棄此結果
          adoptServerMap(canonical);
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
        if (user) schedulePush(next);
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
   * 登入狀態變化的同步策略：union 一次 → 之後一律以 server 為準（canonical）。
   *
   * 為何不每次 refresh 都 union：純 union 只能讓集合變大、無法表達「刪除」，
   * 會讓「別台已清除、本機 localStorage 殘留」的紀錄在 refresh 時被復活並回寫 server。
   * 改為依 SYNCED_UID_KEY 判斷三種情境：
   *   - 未同步過（匿名期本地紀錄）→ 與雲端 union 一次撈救後上傳，避免登入即丟掉本地搜尋。
   *   - 已同步過（本裝置 cache）/ 切換帳號 → 直接採 server canonical（刪除即可正確傳播）。
   * 唯一代價是「離線期新增、尚未上傳」的本地紀錄不會被保留；對火車時刻 app 而言
   * 歷史是線上查詢的副產品，離線無法產生有意義紀錄，此取捨可接受。
   */
  useEffect(() => {
    if (!hydrated || authLoading) return;
    if (!user) return; // 未登入 → 純本地模式

    let cancelled = false;
    const uid = user.uid;
    (async () => {
      try {
        const seq = ++opSeqRef.current;
        const remote = await fetchServerHistory();
        if (cancelled || seq !== opSeqRef.current) return;

        if (localStorage.getItem(SYNCED_UID_KEY) === null) {
          // 匿名期累積的本地紀錄：union 撈救一次，先即時反映畫面
          const local = readAllLocal();
          const merged = emptyMap();
          for (const t of TRAIN_TYPES) {
            merged[t] = sortTrim([...remote[t], ...local[t]]);
          }
          adoptServerMap(merged);
          // 上傳走 runPush，與 save/delete 共用 seq + abort 紀律：並發 fireDelete 可 abort 此 PUT，
          // 避免它在 server 端把剛清除的列復活（復活「刻意清除的列」是使用者回報的主病灶，優先消滅）。
          const pushed = await runPush(merged);
          // 僅在 PUT 確實落地後才標記同步模式：被 abort / 失敗時 flag 維持 null，下次 refresh 仍走 union；
          // 清除過的車種其 local 已是 []，union([], []) = [] 不會復活，再 union 安全。
          //
          // 已接受的邊界：若「首次登入」當下、union 上傳的 sub-second 窗口內清除『另一』車種，
          // 且 abort 早於 server commit，則該未上傳車種的匿名撈救列會被 DELETE 的 canonical
          // （adoptServerMap 整批覆寫 local）洗掉而遺失。觸發機率極低且僅損匿名便利資料（重搜即回），
          // 取捨上優於「不可 abort 導致刻意清除的列復活」，故不為此加複雜度。
          if (pushed && !cancelled) localStorage.setItem(SYNCED_UID_KEY, uid);
        } else {
          // 已同步過 / 切換帳號：server 即唯一真相，不再 union 本機殘留
          if (cancelled || seq !== opSeqRef.current) return;
          adoptServerMap(remote);
          localStorage.setItem(SYNCED_UID_KEY, uid);
        }
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

  /** 卸載時清除排程中的 push、中止進行中的 PUT，並讓所有 in-flight 回應的 seq 守衛失效 */
  useEffect(() => {
    return () => {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
      pushAbortRef.current?.abort();
      // 之後任何晚到的 DELETE/PUT 回應 seq 比對皆失敗，不再 adopt/setState（刻意於 cleanup 遞增計數）
      // eslint-disable-next-line react-hooks/exhaustive-deps
      opSeqRef.current++;
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
