import { TrainType } from "./history";

/** 各車種常用路線（收藏）上限 */
export const MAX_FAVORITES = 5;

/** 收藏單筆：起迄站 + 收藏時間（createdAt 作為常用分頁排序、跨裝置 union 依據） */
export interface FavoriteRoute {
  startStationId: string;
  endStationId: string;
  createdAt: number;
}

/** 依車種分組的收藏 map（各車種 ≤ MAX_FAVORITES，createdAt 由新到舊） */
export type FavoriteRouteMap = Record<TrainType, FavoriteRoute[]>;

/** 加入收藏結果：成功 / 已達上限被拒 */
export type AddFavoriteResult = "added" | "limit";
