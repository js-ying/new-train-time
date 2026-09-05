import { JsyBusStopBoardsBatch } from "@/models/jsy-bus-info";
import { getBusStopBoardsBatch } from "@/services/busService";
import { BusStopFavoriteKey } from "@/utils/BusStopFavoriteUtils";
import {
  AutoRefreshDataResult,
  useAutoRefreshData,
} from "./useAutoRefreshData";

/**
 * 收藏站點看板資料 hook（薄包裝 useAutoRefreshData，輪詢/登入/刷新邏輯共用）。
 * keys 為空（無收藏 / 未登入）→ 不查詢；收藏增減 → key 變更自動重抓。
 */
export const useBusFavoriteStopBoards = (
  keys: BusStopFavoriteKey[],
): AutoRefreshDataResult<JsyBusStopBoardsBatch> =>
  useAutoRefreshData<JsyBusStopBoardsBatch>(
    keys.length > 0 ? (signal) => getBusStopBoardsBatch(keys, signal) : null,
    // 排序後再組 key：回應以三元組對回各列，順序不影響內容，重排不必重抓
    keys.length > 0
      ? keys
          .map((k) => `${k.stopUid}|${k.routeUid}|${k.direction}|${k.subRouteName ?? ""}`)
          .sort()
          .join(",")
      : null,
  );

export default useBusFavoriteStopBoards;
