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
 * - favoriteList：該車種收藏（createdAt 由新到舊，≤ MAX_FAVORITES）
 * - addFavorite / removeFavorite / isFavorite：以當前車種操作
 */
export const useFavoriteRoutes = () => {
  const { page } = usePage();
  const { favorites, addFavorite, removeFavorite, isFavorite } =
    useContext(FavoriteRoutesContext);
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

  return {
    favoriteList,
    addFavorite: add,
    removeFavorite: remove,
    isFavorite: isFav,
  };
};

export default useFavoriteRoutes;
