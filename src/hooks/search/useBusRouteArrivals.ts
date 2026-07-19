import { BusSource, JsyBusRouteBoard } from "@/models/jsy-bus-info";
import { getBusRouteArrivals } from "@/services/busService";
import {
  AutoRefreshDataResult,
  POLL_INTERVAL_MS,
  useAutoRefreshData,
} from "./useAutoRefreshData";

export { POLL_INTERVAL_MS };

/** 看板查詢的最小選擇（驅動 fetch 的 key）。 */
export interface BusRouteSelection {
  routeUid: string;
  source: BusSource;
  city?: string;
  /** 使用者選的子線名（如 1822A）；後端據此篩骨幹。route 粒度無此值。 */
  subRouteName?: string;
}

/**
 * 公車雙向即時看板資料 hook（薄包裝 useAutoRefreshData）。
 * 選定路線後抓 arrivals（站序 + N1 已貼合，回兩個方向），輪詢/登入/刷新邏輯見 useAutoRefreshData。
 */
export const useBusRouteArrivals = (
  selection: BusRouteSelection | null,
): AutoRefreshDataResult<JsyBusRouteBoard[]> =>
  useAutoRefreshData<JsyBusRouteBoard[]>(
    selection
      ? (signal, isInitial) =>
          getBusRouteArrivals(
            selection.routeUid,
            selection.source,
            selection.city,
            selection.subRouteName,
            signal,
            isInitial, // 初次選定才記 analytics（輪詢不重複累計）
          )
      : null,
    selection
      ? `${selection.routeUid}|${selection.source}|${selection.city ?? ""}|${selection.subRouteName ?? ""}`
      : null,
  );

export default useBusRouteArrivals;
