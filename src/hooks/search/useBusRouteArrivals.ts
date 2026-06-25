import { useAuth } from "@/contexts/AuthContext";
import { BusSource, JsyBusRouteBoard } from "@/models/jsy-bus-info";
import { ApiError, toApiError } from "@/models/problem-details";
import { getBusRouteArrivals } from "@/services/busService";
import { useCallback, useEffect, useRef, useState } from "react";

/** premium 自動輪詢間隔（毫秒）。公車 N1 約每 20s 變動，輪詢有實質意義。 */
const POLL_INTERVAL_MS = 20 * 1000;
/** 非會員手動重新整理冷卻（毫秒）：每 10s 限按一次，省 TDX 月點數。 */
const MANUAL_REFRESH_COOLDOWN_MS = 10 * 1000;

/** 看板查詢的最小選擇（驅動 fetch 的 key）。 */
export interface BusRouteSelection {
  routeUid: string;
  source: BusSource;
  city?: string;
}

interface UseBusRouteArrivalsResult {
  data: JsyBusRouteBoard[] | null;
  error: ApiError | null;
  isLoading: boolean;
  /** 最後成功更新的時間戳（毫秒）；供「更新於 HH:mm:ss」顯示 */
  lastUpdatedAt: number | null;
  /** 是否 premium（決定自動輪詢 vs 手動重新整理 UI） */
  isPremium: boolean;
  /** 手動重新整理進行中（含冷卻），按鈕據此 disable */
  isRefreshing: boolean;
  /** 手動重新整理（非會員用）；冷卻中呼叫無效 */
  refresh: () => void;
}

/**
 * 公車雙向即時看板資料 hook。
 * - 選定路線後抓 arrivals（站序 + N1 已貼合，回兩個方向），失敗保留前一份（stale-on-error）。
 * - premium：頁面 visible 且 focus 時每 20s 自動輪詢；切背景暫停、回前景立即刷新。
 * - 非會員：不自動輪詢，提供手動重新整理（10s 冷卻）。
 */
export const useBusRouteArrivals = (
  selection: BusRouteSelection | null,
): UseBusRouteArrivalsResult => {
  const { profile } = useAuth();
  const isPremium = !!profile?.isPremium;

  const [data, setData] = useState<JsyBusRouteBoard[] | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cooldownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelledRef = useRef(false);

  // 把目前選擇放進 ref，讓輪詢 loop 永遠取最新值、不必為此重建
  const selectionRef = useRef<BusRouteSelection | null>(selection);
  selectionRef.current = selection;

  /** 抓一次看板；showLoading 控制是否顯示全頁 loading（輪詢刷新不顯示，避免閃爍）。 */
  const runFetch = useCallback(async (showLoading: boolean) => {
    const sel = selectionRef.current;
    if (!sel) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    if (showLoading) setIsLoading(true);
    try {
      const result = await getBusRouteArrivals(
        sel.routeUid,
        sel.source,
        sel.city,
        controller.signal,
      );
      if (controller.signal.aborted) return;
      setData(result);
      setError(null);
      setLastUpdatedAt(Date.now());
    } catch (err) {
      if (controller.signal.aborted || (err as Error)?.name === "AbortError") {
        return;
      }
      // 輪詢失敗保留前一份資料（stale-on-error），只記錄錯誤
      setError(toApiError(err));
    } finally {
      // 只在「最新一棒」且未被 abort 時清 loading：
      // 避免被後續 fetch abort 的舊請求漏關 loading（會卡住全頁遮罩），卸載 abort 時也不誤觸 setState。
      if (abortRef.current === controller && !controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  // 選擇變更（含首載）：清舊看板、抓首筆；premium 再掛輪詢
  useEffect(() => {
    cancelledRef.current = false;
    if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    // 換路線：清掉上一條路線殘留的手動刷新冷卻，新路線從可立即刷新的乾淨狀態開始
    if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
    setIsRefreshing(false);

    if (!selection) {
      setData(null);
      setError(null);
      setIsLoading(false);
      setLastUpdatedAt(null);
      return;
    }

    // 換路線先清舊看板，避免閃到上一條路線殘影
    setData(null);
    setError(null);
    setLastUpdatedAt(null);
    void runFetch(true);

    // 非會員：不自動輪詢，僅靠手動重新整理
    if (!isPremium) {
      return () => {
        cancelledRef.current = true;
        abortRef.current?.abort();
      };
    }

    // premium：只在頁面 visible 且 focus 時輪詢（省配額；切背景暫停）
    const isActive = () =>
      typeof document !== "undefined" &&
      document.visibilityState === "visible" &&
      document.hasFocus();

    const scheduleNext = () => {
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
      pollTimerRef.current = setTimeout(tick, POLL_INTERVAL_MS);
    };

    const tick = async () => {
      if (cancelledRef.current) return;
      if (isActive()) await runFetch(false);
      if (cancelledRef.current) return;
      scheduleNext();
    };

    scheduleNext();

    // 回到前景（visible / focus）立即刷新並重排下一次輪詢。
    // visibilitychange 與 focus 可能近乎同時派發，用 wasActive 守門只在「非 active→active」轉換觸發一次，避免雙重抓取。
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
    // selection 物件每次 render 可能換 identity，只依其原始欄位與 premium 重建
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection?.routeUid, selection?.source, selection?.city, isPremium]);

  // 卸載清冷卻 timer
  useEffect(
    () => () => {
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
    },
    [],
  );

  const refresh = useCallback(() => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    void runFetch(false);
    if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
    cooldownTimerRef.current = setTimeout(() => {
      setIsRefreshing(false);
    }, MANUAL_REFRESH_COOLDOWN_MS);
  }, [isRefreshing, runFetch]);

  return {
    data,
    error,
    isLoading,
    lastUpdatedAt,
    isPremium,
    isRefreshing,
    refresh,
  };
};

export default useBusRouteArrivals;
