import HeartIcon from "@/components/icons/HeartIcon";
import { useAuth } from "@/contexts/AuthContext";
import { GaEnum } from "@/enums/GaEnum";
import useStationFavorites from "@/hooks/useStationFavorites";
import useSetting from "@/hooks/useSetting";
import { StationTarget, StationTrainType } from "@/models/station-history";
import { gaClickEvent } from "@/utils/GaUtils";
import { useTranslation } from "next-i18next";
import { FC, useState } from "react";
import CommonDialog from "../common/CommonDialog";

interface StationFavoriteButtonProps {
  /** TR=台鐵單站、BUS=公車路線、STOP=公車站牌；決定收藏分組與文案 */
  trainType: StationTrainType;
  /** 目前選定的目標（站 / 路線 / 站牌）；null 則不顯示愛心 */
  target: StationTarget | null;
  /** 愛心尺寸 class（預設 h-5 w-5，與 OD 收藏愛心一致） */
  className?: string;
}

/** 未登入 / 已達上限提示文案，依車種切「車站 / 路線 / 站牌」 */
const FAVORITE_TEXT_KEYS: Record<
  StationTrainType,
  { requiresLogin: string; limitReached: string }
> = {
  TR: {
    requiresLogin: "favoriteStationRequiresLogin",
    limitReached: "favoriteStationLimitReached",
  },
  BUS: {
    requiresLogin: "favoriteRequiresLogin",
    limitReached: "favoriteLimitReached",
  },
  BUS_STOP: {
    requiresLogin: "favoriteStopRequiresLogin",
    limitReached: "favoriteStopLimitReached",
  },
};

/**
 * 單點收藏愛心：收藏 / 取消收藏「當前選定的車站、路線或站牌」。
 * 與 OD FavoriteButton 對應，差別在收藏目標為單一 target、且文案依車種切換。
 * 未登入跳登入引導、已滿跳上限提示，與單點查詢頁的歷史面板共用 StationFavoritesContext。
 */
const StationFavoriteButton: FC<StationFavoriteButtonProps> = ({
  trainType,
  target,
  className = "h-5 w-5",
}) => {
  const { t } = useTranslation();
  const { user, loginWithGoogle } = useAuth();
  const { limit, addFavorite, removeFavorite, isFavorite } =
    useStationFavorites(trainType);
  const [showFavoriteRoutes] = useSetting("showFavoriteRoutes");

  const [loginOpen, setLoginOpen] = useState(false);
  const [limitOpen, setLimitOpen] = useState(false);

  const { requiresLogin: requiresLoginKey, limitReached: limitReachedKey } =
    FAVORITE_TEXT_KEYS[trainType];

  // 使用者關閉常用功能 → 不顯示愛心（與 OD 一致）
  if (!showFavoriteRoutes) return null;
  if (!target) return null;

  const isFavorited = isFavorite(target.targetId);

  const handleClick = () => {
    if (!user) {
      setLoginOpen(true);
      return;
    }
    gaClickEvent(isFavorited ? GaEnum.UNFAVORITE_ROUTE : GaEnum.FAVORITE_ROUTE);
    if (isFavorited) {
      removeFavorite(target.targetId);
    } else if (addFavorite(target) === "limit") {
      setLimitOpen(true);
    }
  };

  return (
    <>
      <button
        type="button"
        aria-label="favorite-toggle"
        // inline-flex 消除 svg 的 baseline 行高間隙，讓愛心在 top-1/2 置中槽真正垂直置中
        className={`inline-flex items-center ${
          isFavorited
            ? "text-rose-500 dark:text-rose-500/80"
            : "text-zinc-400 dark:text-zinc-500"
        }`}
        onClick={handleClick}
      >
        <HeartIcon filled={isFavorited} className={className} />
      </button>

      {/* 未登入點愛心：引導登入 */}
      <CommonDialog
        open={loginOpen}
        setOpen={setLoginOpen}
        title="favoriteRequiresLoginTitle"
        confirmText="login"
        cancelText="cancel"
        onConfirm={() => {
          gaClickEvent(GaEnum.LOGIN_WITH_GOOGLE);
          void loginWithGoogle();
        }}
      >
        {t(requiresLoginKey)}
      </CommonDialog>

      {/* 收藏已滿 5 筆：提示先移除 */}
      <CommonDialog
        open={limitOpen}
        setOpen={setLimitOpen}
        title="favoriteLimitTitle"
        confirmText="gotItLabel"
      >
        {t(limitReachedKey, { max: limit })}
      </CommonDialog>
    </>
  );
};

export default StationFavoriteButton;
