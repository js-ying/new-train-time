import { useAuth } from "@/contexts/AuthContext";
import { ApiError, toApiError } from "@/models/problem-details";
import { useCallback, useEffect, useRef, useState } from "react";

/** 登入會員的即時看板自動輪詢間隔（毫秒）。 */
export const POLL_INTERVAL_MS = 10 * 1000;

/** 輪詢連續失敗的退避間隔上限（毫秒）；失敗 streak 指數放大間隔（10s→20s→40s→60s），成功即回復。 */
export const MAX_POLL_BACKOFF_MS = 60 * 1000;

/** 手動刷新冷卻（毫秒）；登入（點倒數環）/ 未登入（刷新鈕）共用。 */
export const REFRESH_COOLDOWN_MS = 5 * 1000;

/**
 * 連續無操作達此時間 → 暫停自動輪詢，由頁面跳「您似乎已離開」彈窗。
 * 5 分鐘：大於「等車時盯著倒數」的連續觀看窗（手機純看畫面不產生事件），不誤打斷正在看的人。
 */
export const AUTO_REFRESH_IDLE_MS = 5 * 60 * 1000;

export interface AutoRefreshDataResult<T> {
  data: T | null;
  error: ApiError | null;
  isLoading: boolean;
  /** 最後成功更新的時間戳（毫秒）。 */
  lastUpdatedAt: number | null;
  /** 是否啟用自動輪詢（已登入會員即可）。 */
  isAutoRefresh: boolean;
  /** 下次自動輪詢的時間戳（毫秒）；供倒數環換算，未啟用為 null。 */
  nextUpdateAt: number | null;
  /** 目前生效的輪詢間隔（毫秒）；連續失敗退避時會大於 POLL_INTERVAL_MS，供倒數環換算。 */
  pollIntervalMs: number;
  /** 手動重新整理：重抓一次並重排輪詢（環補滿）；冷卻攔截由頁面處理。 */
  refresh: () => void;
  /** 久無操作已暫停輪詢、待使用者確認是否續看（僅自動輪詢會員會 true）。 */
  isIdle: boolean;
  /** 使用者確認仍在看 → 解除 idle、立即刷新並恢復輪詢。 */
  resumeAutoRefresh: () => void;
}

/**
 * 即時看板通用輪詢 hook（路線看板 / 站牌看板共用）。
 * - 選擇變更（key）→ 清舊資料、抓首筆、登入會員再掛輪詢；失敗保留前一份（stale-on-error）。
 * - 登入會員：頁面 visible 且 focus 時每 10s 自動輪詢；切背景暫停、回前景立即刷新。
 * - 未登入：不自動輪詢，僅靠 refresh。
 * @param fetcher 依 signal 抓一份資料；null = 無選擇。可直接取最新 state（閉包已處理）。
 *               isInitial=true 僅在「換選擇的首抓」傳入（輪詢/刷新/回前景皆為 false），供呼叫端做 analytics 去重。
 * @param key 選擇 key（變更時重抓 + 重掛輪詢）；null/"" = 無選擇（清空）。
 */
export const useAutoRefreshData = <T>(
  fetcher: ((signal: AbortSignal, isInitial: boolean) => Promise<T>) | null,
  key: string | null,
): AutoRefreshDataResult<T> => {
  const { user } = useAuth();
  const isAutoRefresh = !!user;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null);
  const [nextUpdateAt, setNextUpdateAt] = useState<number | null>(null);
  const [pollIntervalMs, setPollIntervalMs] = useState(POLL_INTERVAL_MS);
  const [isIdle, setIsIdle] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelledRef = useRef(false);
  // idle（久無操作）相關：idleRef 鏡像供閉包判斷、lastActivityRef 記最後操作時間（idle 判斷折進輪詢 tick）、resumeRef 由 effect 注入恢復函式
  const idleRef = useRef(false);
  const lastActivityRef = useRef(0);
  const resumeRef = useRef<(() => void) | null>(null);
  // 由 effect 注入重排輪詢的函式，供手動刷新重置倒數（未登入無輪詢則維持 null）
  const scheduleRef = useRef<(() => void) | null>(null);
  // fetcher 每 render 換 identity（closure 抓最新選擇）→ 用 ref 取最新，不為此重建輪詢
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;
  // 連續失敗次數：輪詢退避用（成功歸零）；後端掛掉時避免固定 10s 無退避重打
  const failStreakRef = useRef(0);

  /** 進入 idle：停輪詢、收倒數環、亮彈窗旗標（實際彈窗由頁面渲染）。 */
  const goIdle = useCallback(() => {
    if (cancelledRef.current || idleRef.current) return;
    idleRef.current = true;
    if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    pollTimerRef.current = null;
    setNextUpdateAt(null);
    setIsIdle(true);
  }, []);

  const runFetch = useCallback(async (showLoading: boolean) => {
    const fn = fetcherRef.current;
    if (!fn) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    if (showLoading) setIsLoading(true);
    try {
      // showLoading 僅換選擇首抓為 true ⇒ 同時當 isInitial 傳給 fetcher（analytics 去重）
      const result = await fn(controller.signal, showLoading);
      if (controller.signal.aborted) return;
      setData(result);
      setError(null);
      setLastUpdatedAt(Date.now());
      failStreakRef.current = 0;
    } catch (err) {
      if (controller.signal.aborted || (err as Error)?.name === "AbortError") {
        return;
      }
      failStreakRef.current += 1;
      setError(toApiError(err));
    } finally {
      if (abortRef.current === controller && !controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    cancelledRef.current = false;
    idleRef.current = false;
    setIsIdle(false);
    if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    setNextUpdateAt(null);
    // 換選擇重置退避（新查詢從標準間隔開始）
    failStreakRef.current = 0;
    setPollIntervalMs(POLL_INTERVAL_MS);

    if (!key) {
      setData(null);
      setError(null);
      setIsLoading(false);
      setLastUpdatedAt(null);
      return;
    }

    // 換選擇先清舊資料，避免閃到上一份殘影
    setData(null);
    setError(null);
    setLastUpdatedAt(null);
    void runFetch(true);

    if (!isAutoRefresh) {
      return () => {
        cancelledRef.current = true;
        abortRef.current?.abort();
      };
    }

    const isActive = () =>
      typeof document !== "undefined" &&
      document.visibilityState === "visible" &&
      document.hasFocus();

    const scheduleNext = () => {
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
      // 連續失敗指數退避（10s→20s→40s→60s cap），成功後 failStreak 歸零回復 10s
      const delay = Math.min(
        POLL_INTERVAL_MS * 2 ** failStreakRef.current,
        MAX_POLL_BACKOFF_MS,
      );
      setPollIntervalMs(delay);
      setNextUpdateAt(Date.now() + delay);
      pollTimerRef.current = setTimeout(tick, delay);
    };

    const tick = async () => {
      if (cancelledRef.current || idleRef.current) return;
      if (isActive()) {
        // idle 對齊輪詢：同一 isActive() gate 內判斷，背景（失焦/隱藏）不累計閒置
        if (Date.now() - lastActivityRef.current >= AUTO_REFRESH_IDLE_MS) {
          goIdle();
          return;
        }
        await runFetch(false);
      }
      if (cancelledRef.current || idleRef.current) return;
      scheduleNext();
    };

    scheduleNext();
    scheduleRef.current = scheduleNext;

    // AFK 偵測：任何操作更新最後操作時間；idle 判斷由 tick 折進輪詢（同一 isActive() gate）
    const onActivity = () => {
      if (cancelledRef.current || idleRef.current) return; // idle 中需使用者確認，不自動重置
      lastActivityRef.current = Date.now();
    };
    const activityEvents = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
      "wheel",
    ];
    activityEvents.forEach((e) =>
      window.addEventListener(e, onActivity, { passive: true }),
    );
    lastActivityRef.current = Date.now();

    // 使用者確認「還在看」：解除 idle、重置閒置起點、立即刷新並恢復輪詢
    resumeRef.current = () => {
      if (cancelledRef.current) return;
      idleRef.current = false;
      setIsIdle(false);
      lastActivityRef.current = Date.now();
      void runFetch(false);
      scheduleNext();
    };

    // 回前景立即刷新；用 wasActive 守門避免 visibilitychange/focus 雙觸發
    let wasActive = isActive();
    const handleResume = () => {
      if (cancelledRef.current) return;
      const active = isActive();
      if (active === wasActive) return;
      wasActive = active;
      if (!active) return; // 切背景：tick 自會跳過 fetch 與 idle 判斷，無需處理
      if (idleRef.current) {
        resumeRef.current?.(); // 重新聚焦分頁＝續看，順帶解除 idle
      } else {
        lastActivityRef.current = Date.now(); // 回前景重置閒置起點，背景時間不計入
        void runFetch(false);
        scheduleNext();
      }
    };
    document.addEventListener("visibilitychange", handleResume);
    window.addEventListener("focus", handleResume);

    return () => {
      cancelledRef.current = true;
      abortRef.current?.abort();
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
      resumeRef.current = null;
      scheduleRef.current = null;
      activityEvents.forEach((e) => window.removeEventListener(e, onActivity));
      document.removeEventListener("visibilitychange", handleResume);
      window.removeEventListener("focus", handleResume);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, isAutoRefresh]);

  // 手動刷新：重抓並重排輪詢（倒數環隨即補滿）
  const refresh = useCallback(() => {
    void runFetch(false);
    scheduleRef.current?.();
  }, [runFetch]);

  /** 解除 idle（由頁面彈窗確認觸發）；effect 已注入實作於 resumeRef。 */
  const resumeAutoRefresh = useCallback(() => {
    resumeRef.current?.();
  }, []);

  return {
    data,
    error,
    isLoading,
    lastUpdatedAt,
    isAutoRefresh,
    nextUpdateAt,
    pollIntervalMs,
    refresh,
    isIdle,
    resumeAutoRefresh,
  };
};

export default useAutoRefreshData;
