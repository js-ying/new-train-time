import { StationFavoritesContext } from "@/contexts/StationFavoritesContext";
import { AddStationFavoriteResult } from "@/models/station-favorites";
import { StationTarget, StationTrainType } from "@/models/station-history";
import { useCallback, useContext } from "react";

/**
 * 通用單點收藏 hook：依傳入車種（TR 單站 / BUS 路線）從 context 讀寫。
 * - favoriteList：該車種收藏（createdAt 由新到舊，≤ limit）
 * - limit：當下會員身分的收藏上限
 * - addFavorite / removeFavorite / isFavorite：以該車種操作
 */
export const useStationFavorites = (trainType: StationTrainType) => {
  const { favorites, limit, addFavorite, removeFavorite, isFavorite } =
    useContext(StationFavoritesContext);

  const favoriteList = favorites[trainType];

  const add = useCallback(
    (target: StationTarget): AddStationFavoriteResult =>
      addFavorite(trainType, target),
    [addFavorite, trainType],
  );

  const remove = useCallback(
    (targetId: string) => removeFavorite(trainType, targetId),
    [removeFavorite, trainType],
  );

  const isFav = useCallback(
    (targetId: string) => isFavorite(trainType, targetId),
    [isFavorite, trainType],
  );

  return {
    favoriteList,
    limit,
    addFavorite: add,
    removeFavorite: remove,
    isFavorite: isFav,
  };
};

export default useStationFavorites;
