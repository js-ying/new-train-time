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
      ? (signal) =>
          getBusRouteArrivals(
            selection.routeUid,
            selection.source,
            selection.city,
            signal,
          )
      : null,
    selection
      ? `${selection.routeUid}|${selection.source}|${selection.city ?? ""}`
      : null,
  );

export default useBusRouteArrivals;
