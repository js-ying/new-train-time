import { useAuth } from "@/contexts/AuthContext";
import { ApiError, toApiError } from "@/models/problem-details";
import { useCallback, useEffect, useRef, useState } from "react";

/** 登入會員自動輪詢間隔（毫秒）。後端 N1 cache 20s，前端 10s 輪詢讓倒數更即時。 */
export const POLL_INTERVAL_MS = 10 * 1000;

/**
 * 連續無操作達此時間 → 暫停自動輪詢並由頁面跳「您似乎已離開」彈窗，
 * 避免分頁長開（visible+focus 但人離開）空燒 TDX 配額。
 * 5 分鐘：穩穩大於「等車時盯著倒數」的連續觀看窗（手機無 mousemove，純看畫面不產生事件），
 * 不誤打斷正在看的人；棄置分頁最多多撐 5 分鐘（後端 N1 20s cache ≈ 15 次抓取）即停。
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
  /** 手動重新整理（單純重抓一次；冷卻攔截由頁面處理）。 */
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
  const [isIdle, setIsIdle] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelledRef = useRef(false);
  // idle（久無操作）相關：idleRef 鏡像供閉包判斷、idleTimerRef AFK 計時、resumeRef 由 effect 注入恢復函式
  const idleRef = useRef(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastActivityRef = useRef(0);
  const resumeRef = useRef<(() => void) | null>(null);
  // fetcher 每 render 換 identity（closure 抓最新選擇）→ 用 ref 取最新，不為此重建輪詢
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

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
    } catch (err) {
      if (controller.signal.aborted || (err as Error)?.name === "AbortError") {
        return;
      }
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
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    setNextUpdateAt(null);

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
      setNextUpdateAt(Date.now() + POLL_INTERVAL_MS);
      pollTimerRef.current = setTimeout(tick, POLL_INTERVAL_MS);
    };

    const tick = async () => {
      if (cancelledRef.current || idleRef.current) return;
      if (isActive()) await runFetch(false);
      if (cancelledRef.current || idleRef.current) return;
      scheduleNext();
    };

    scheduleNext();

    // AFK 偵測：任何操作重啟 AFK 計時（節流 1s）；達 AUTO_REFRESH_IDLE_MS 無操作 → goIdle（停輪詢 + 亮彈窗）
    const armIdleTimer = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(goIdle, AUTO_REFRESH_IDLE_MS);
    };
    const onActivity = () => {
      if (cancelledRef.current || idleRef.current) return; // idle 中需使用者確認，不自動重置
      const now = Date.now();
      if (now - lastActivityRef.current < 1000) return; // 節流，避免 mousemove 狂洗 timer
      lastActivityRef.current = now;
      armIdleTimer();
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
    armIdleTimer();

    // 使用者確認「還在看」：解除 idle、重啟 AFK 計時、立即刷新並恢復輪詢
    resumeRef.current = () => {
      if (cancelledRef.current) return;
      idleRef.current = false;
      setIsIdle(false);
      lastActivityRef.current = Date.now();
      armIdleTimer();
      void runFetch(false);
      scheduleNext();
    };

    // 回前景立即刷新；用 wasActive 守門避免 visibilitychange/focus 雙觸發
    let wasActive = isActive();
    const handleResume = () => {
      if (cancelledRef.current) return;
      const active = isActive();
      if (active && !wasActive) {
        wasActive = true;
        if (idleRef.current) {
          resumeRef.current?.(); // 重新聚焦分頁＝續看，順帶解除 idle
        } else {
          void runFetch(false);
          scheduleNext();
        }
      } else {
        wasActive = active;
      }
    };
    document.addEventListener("visibilitychange", handleResume);
    window.addEventListener("focus", handleResume);

    return () => {
      cancelledRef.current = true;
      abortRef.current?.abort();
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      resumeRef.current = null;
      activityEvents.forEach((e) => window.removeEventListener(e, onActivity));
      document.removeEventListener("visibilitychange", handleResume);
      window.removeEventListener("focus", handleResume);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, isAutoRefresh]);

  const refresh = useCallback(() => {
    void runFetch(false);
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
    refresh,
    isIdle,
    resumeAutoRefresh,
  };
};

export default useAutoRefreshData;
