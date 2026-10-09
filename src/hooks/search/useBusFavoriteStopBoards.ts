import { useAuth } from "@/contexts/AuthContext";
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
 * batch 為會員 API：收藏會先由本地快取呈現，須等 auth 確定有 user 才查（否則首抓必 401）。
 */
export const useBusFavoriteStopBoards = (
  keys: BusStopFavoriteKey[],
): AutoRefreshDataResult<JsyBusStopBoardsBatch> => {
  const { user, loading: authLoading } = useAuth();
  const enabled = keys.length > 0 && !authLoading && user != null;
  return useAutoRefreshData<JsyBusStopBoardsBatch>(
    enabled ? (signal) => getBusStopBoardsBatch(keys, signal) : null,
    // 排序後再組 key：回應以三元組對回各列，順序不影響內容，重排不必重抓
    enabled
      ? keys
          .map(
            (k) =>
              `${k.stopUid}|${k.routeUid}|${k.direction}|${k.subRouteName ?? ""}`,
          )
          .sort()
          .join(",")
      : null,
    // 增減收藏時舊列維持顯示（各列以 targetId 對回），只有新加的列顯示載入中
    { keepPreviousData: true },
  );
};

export default useBusFavoriteStopBoards;
