import { StationTarget, StationTrainType } from "./station-history";

/** 收藏單筆：單點 target + 收藏時間（createdAt 作為跨裝置 union 去重依據） */
export interface StationFavorite extends StationTarget {
  createdAt: number;
}

/** 依車種分組的收藏 map（各車種 ≤ 會員上限，陣列順序即使用者自訂的顯示順序） */
export type StationFavoriteMap = Record<StationTrainType, StationFavorite[]>;

/** 加入收藏結果：成功 / 已達上限被拒 */
export type AddStationFavoriteResult = "added" | "limit";
