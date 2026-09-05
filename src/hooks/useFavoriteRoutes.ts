import { FavoriteRoutesContext } from "@/contexts/FavoriteRoutesContext";
import { PageEnum } from "@/enums/PageEnum";
import { AddFavoriteResult, FavoriteRoute } from "@/models/favorite-routes";
import { TrainType } from "@/models/history";
import { useCallback, useContext } from "react";
import usePage from "./usePage";

/** 頁面 → 車種；非交通工具頁面回 undefined → 不參與收藏 */
const PAGE_TO_TRAIN_TYPE: Partial<Record<PageEnum, TrainType>> = {
  [PageEnum.TR]: "TR",
  [PageEnum.THSR]: "THSR",
  [PageEnum.TYMC]: "TYMC",
};

/**
 * 常用路線 hook：依當前頁面對應車種，從 FavoriteRoutesContext 讀寫。
 * - favoriteList：該車種收藏（使用者自訂順序，≤ limit）
 * - limit：當下會員身分的收藏上限
 * - addFavorite / removeFavorite / isFavorite / reorderFavorites：以當前車種操作
 */
export const useFavoriteRoutes = () => {
  const { page } = usePage();
  const {
    favorites,
    limit,
    addFavorite,
    removeFavorite,
    isFavorite,
    reorderFavorites,
  } = useContext(FavoriteRoutesContext);
  const trainType = PAGE_TO_TRAIN_TYPE[page];

  const favoriteList: FavoriteRoute[] = trainType ? favorites[trainType] : [];

  const add = useCallback(
    (startStationId: string, endStationId: string): AddFavoriteResult => {
      if (!trainType) return "added";
      return addFavorite(trainType, startStationId, endStationId);
    },
    [addFavorite, trainType],
  );

  const remove = useCallback(
    (startStationId: string, endStationId: string) => {
      if (!trainType) return;
      removeFavorite(trainType, startStationId, endStationId);
    },
    [removeFavorite, trainType],
  );

  const isFav = useCallback(
    (startStationId: string, endStationId: string) =>
      trainType ? isFavorite(trainType, startStationId, endStationId) : false,
    [isFavorite, trainType],
  );

  const reorder = useCallback(
    (orderedKeys: string[]) => {
      if (!trainType) return;
      reorderFavorites(trainType, orderedKeys);
    },
    [reorderFavorites, trainType],
  );

  return {
    favoriteList,
    limit,
    addFavorite: add,
    removeFavorite: remove,
    isFavorite: isFav,
    reorderFavorites: reorder,
  };
};

export default useFavoriteRoutes;
