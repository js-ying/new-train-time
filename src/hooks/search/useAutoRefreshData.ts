import { useAuth } from "@/contexts/AuthContext";
import { ApiError, toApiError } from "@/models/problem-details";
import { useCallback, useEffect, useRef, useState } from "react";

/** 登入會員自動輪詢間隔（毫秒）。後端 N1 cache 20s，前端 10s 輪詢讓倒數更即時。 */
export const POLL_INTERVAL_MS = 10 * 1000;

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
}

/**
 * 即時看板通用輪詢 hook（路線看板 / 站牌看板共用）。
 * - 選擇變更（key）→ 清舊資料、抓首筆、登入會員再掛輪詢；失敗保留前一份（stale-on-error）。
 * - 登入會員：頁面 visible 且 focus 時每 10s 自動輪詢；切背景暫停、回前景立即刷新。
 * - 未登入：不自動輪詢，僅靠 refresh。
 * @param fetcher 依 signal 抓一份資料；null = 無選擇。可直接取最新 state（閉包已處理）。
 * @param key 選擇 key（變更時重抓 + 重掛輪詢）；null/"" = 無選擇（清空）。
 */
export const useAutoRefreshData = <T>(
  fetcher: ((signal: AbortSignal) => Promise<T>) | null,
  key: string | null,
): AutoRefreshDataResult<T> => {
  const { user } = useAuth();
  const isAutoRefresh = !!user;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null);
  const [nextUpdateAt, setNextUpdateAt] = useState<number | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelledRef = useRef(false);
  // fetcher 每 render 換 identity（closure 抓最新選擇）→ 用 ref 取最新，不為此重建輪詢
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const runFetch = useCallback(async (showLoading: boolean) => {
    const fn = fetcherRef.current;
    if (!fn) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    if (showLoading) setIsLoading(true);
    try {
      const result = await fn(controller.signal);
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
    if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
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
      if (cancelledRef.current) return;
      if (isActive()) await runFetch(false);
      if (cancelledRef.current) return;
      scheduleNext();
    };

    scheduleNext();

    // 回前景立即刷新；用 wasActive 守門避免 visibilitychange/focus 雙觸發
    let wasActive = isActive();
    const handleResume = () => {
      if (cancelledRef.current) return;
      const active = isActive();
      if (active && !wasActive) {
        wasActive = true;
        void runFetch(false);
        scheduleNext();
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
      document.removeEventListener("visibilitychange", handleResume);
      window.removeEventListener("focus", handleResume);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, isAutoRefresh]);

  const refresh = useCallback(() => {
    void runFetch(false);
  }, [runFetch]);

  return {
    data,
    error,
    isLoading,
    lastUpdatedAt,
    isAutoRefresh,
    nextUpdateAt,
    refresh,
  };
};

export default useAutoRefreshData;
