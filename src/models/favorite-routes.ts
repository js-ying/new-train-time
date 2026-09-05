import { TrainType } from "./history";

/** 收藏單筆：起迄站 + 收藏時間（createdAt 作為跨裝置 union 去重依據） */
export interface FavoriteRoute {
  startStationId: string;
  endStationId: string;
  createdAt: number;
}

/** 依車種分組的收藏 map（各車種 ≤ 會員上限，陣列順序即使用者自訂的顯示順序） */
export type FavoriteRouteMap = Record<TrainType, FavoriteRoute[]>;

/** 加入收藏結果：成功 / 已達上限被拒 */
export type AddFavoriteResult = "added" | "limit";
