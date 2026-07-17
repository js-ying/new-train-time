import { StationTarget, StationTrainType } from "./station-history";

/** 各車種單點收藏上限（TR 單站 / BUS 路線） */
export const MAX_STATION_FAVORITES = 5;
/** BUS_STOP（站牌×路線×方向）收藏上限 */
export const MAX_STOP_FAVORITES = 5;

/** 取該車種收藏上限 */
export const maxStationFavorites = (trainType: StationTrainType): number =>
  trainType === "BUS_STOP" ? MAX_STOP_FAVORITES : MAX_STATION_FAVORITES;

/** 收藏單筆：單點 target + 收藏時間（createdAt 作排序、跨裝置 union 依據） */
export interface StationFavorite extends StationTarget {
  createdAt: number;
}

/** 依車種分組的收藏 map（各車種 ≤ MAX_STATION_FAVORITES，createdAt 由新到舊） */
export type StationFavoriteMap = Record<StationTrainType, StationFavorite[]>;

/** 加入收藏結果：成功 / 已達上限被拒 */
export type AddStationFavoriteResult = "added" | "limit";
