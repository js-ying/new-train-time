import { JsyBusStopBoard } from "@/models/jsy-bus-info";
import { getBusStopBoard } from "@/services/busService";
import {
  AutoRefreshDataResult,
  useAutoRefreshData,
} from "./useAutoRefreshData";

/** 站牌看板查詢的最小選擇（單錨 StopUID，與路線頁 routeUid 對稱；source/city/stopName 後端反查）。 */
export interface BusStopSelection {
  stopUid: string;
}

/** 站牌即時看板資料 hook（薄包裝 useAutoRefreshData，輪詢/登入/刷新邏輯共用）。 */
export const useBusStopBoard = (
  selection: BusStopSelection | null,
): AutoRefreshDataResult<JsyBusStopBoard> =>
  useAutoRefreshData<JsyBusStopBoard>(
    selection ? (signal) => getBusStopBoard(selection.stopUid, signal) : null,
    selection ? selection.stopUid : null,
  );

export default useBusStopBoard;
