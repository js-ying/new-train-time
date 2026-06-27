import { JsyBusStopBoard } from "@/models/jsy-bus-info";
import { getBusStopBoard } from "@/services/busService";
import {
  AutoRefreshDataResult,
  useAutoRefreshData,
} from "./useAutoRefreshData";

/** 站牌看板查詢的最小選擇。 */
export interface BusStopSelection {
  city: string;
  stopName: string;
}

/** 站牌即時看板資料 hook（薄包裝 useAutoRefreshData，輪詢/登入/刷新邏輯共用）。 */
export const useBusStopBoard = (
  selection: BusStopSelection | null,
): AutoRefreshDataResult<JsyBusStopBoard> =>
  useAutoRefreshData<JsyBusStopBoard>(
    selection
      ? (signal) =>
          getBusStopBoard(selection.city, selection.stopName, signal)
      : null,
    selection ? `${selection.city}|${selection.stopName}` : null,
  );

export default useBusStopBoard;
