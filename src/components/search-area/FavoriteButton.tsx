import { useAuth } from "@/contexts/AuthContext";
import { SearchAreaContext } from "@/contexts/SearchAreaContext";
import { GaEnum } from "@/enums/GaEnum";
import useFavoriteRoutes from "@/hooks/useFavoriteRoutes";
import useSetting from "@/hooks/useSetting";
import { gaClickEvent } from "@/utils/GaUtils";
import { useTranslation } from "next-i18next";
import { FC, useContext, useState } from "react";
import CommonDialog from "../common/CommonDialog";
import HeartIcon from "../icons/HeartIcon";

/**
 * /search 收藏愛心：收藏 / 取消收藏「當前查詢的 OD」。
 * 放在搜尋按鈕列右側（相對 OperationAlert）；OD 不完整則不顯示。
 * 未登入跳登入引導、收藏已滿跳上限提示，與首頁常用路線共用 FavoriteRoutesContext。
 */
const FavoriteButton: FC = () => {
  const { t } = useTranslation();
  const params = useContext(SearchAreaContext);
  const { user, loginWithGoogle } = useAuth();
  const { addFavorite, removeFavorite, isFavorite } = useFavoriteRoutes();
  const [showFavoriteRoutes] = useSetting("showFavoriteRoutes");

  const [loginOpen, setLoginOpen] = useState(false);
  const [limitOpen, setLimitOpen] = useState(false);

  const start = params?.startStationId;
  const end = params?.endStationId;
  const hasOd = !!start && !!end;
  const isFavorited = hasOd && isFavorite(start, end);

  // 使用者關閉常用路線 → 不顯示愛心（與搜尋區分頁的隱藏一致）
  if (!showFavoriteRoutes) return null;
  // OD 不完整（首次載入 URL 尚未同步）不顯示，避免收藏空查詢
  if (!hasOd) return null;

  const handleClick = () => {
    if (!user) {
      setLoginOpen(true);
      return;
    }
    gaClickEvent(isFavorited ? GaEnum.UNFAVORITE_ROUTE : GaEnum.FAVORITE_ROUTE);
    if (isFavorited) {
      removeFavorite(start, end);
    } else if (addFavorite(start, end) === "limit") {
      setLimitOpen(true);
    }
  };

  return (
    <>
      <button
        type="button"
        aria-label="favorite-toggle"
        className={
          isFavorited
            ? "text-rose-500 dark:text-rose-500/80"
            : "text-zinc-400 dark:text-zinc-500"
        }
        onClick={handleClick}
      >
        <HeartIcon filled={isFavorited} className="h-5 w-5" />
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
        {t("favoriteRequiresLogin")}
      </CommonDialog>

      {/* 收藏已滿 5 筆：提示先移除 */}
      <CommonDialog
        open={limitOpen}
        setOpen={setLimitOpen}
        title="favoriteLimitTitle"
        confirmText="gotItLabel"
      >
        {t("favoriteLimitReached")}
      </CommonDialog>
    </>
  );
};

export default FavoriteButton;
