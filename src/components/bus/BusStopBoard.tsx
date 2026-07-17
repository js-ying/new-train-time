import AdBanner from "@/components/common/AdBanner";
import CommonDialog from "@/components/common/CommonDialog";
import HeartIcon from "@/components/icons/HeartIcon";
import { useAuth } from "@/contexts/AuthContext";
import { GaEnum } from "@/enums/GaEnum";
import useSetting from "@/hooks/useSetting";
import useStationFavorites from "@/hooks/useStationFavorites";
import { JsyBusStopBoard, JsyBusStopBoardRoute } from "@/models/jsy-bus-info";
import AdUtils from "@/utils/AdUtils";
import {
  encodeBusStopFavoriteId,
  encodeBusStopFavoriteName,
} from "@/utils/BusStopFavoriteUtils";
import { gaClickEvent } from "@/utils/GaUtils";
import { useTranslation } from "next-i18next";
import { FC, useState } from "react";
import BusArrivalBadge from "./BusArrivalBadge";

interface BusStopBoardProps {
  board: JsyBusStopBoard;
  /** 當前柱 StopUID（列愛心收藏的三元組錨；同名多柱時各柱收藏各自獨立）。 */
  stopUid: string;
  /** 點某路線 → 跳該路線看板（帶 routeUid + board 所在縣市）。 */
  onSelectRoute: (route: JsyBusStopBoardRoute) => void;
}

/**
 * [公車] 站牌即時看板：列出該站牌所有路線的到站（可點進路線看板），依到站排序。
 * 每列愛心＝收藏該（站牌×路線×方向）到站（BUS_STOP 分組）。
 */
const BusStopBoard: FC<BusStopBoardProps> = ({
  board,
  stopUid,
  onSelectRoute,
}) => {
  const { t } = useTranslation();
  const { user, loginWithGoogle } = useAuth();
  const { addFavorite, removeFavorite, isFavorite } =
    useStationFavorites("BUS_STOP");
  const [showFavoriteRoutes] = useSetting("showFavoriteRoutes");

  const [loginOpen, setLoginOpen] = useState(false);
  const [limitOpen, setLimitOpen] = useState(false);

  const handleToggleFavorite = (r: JsyBusStopBoardRoute) => {
    if (!user) {
      setLoginOpen(true);
      return;
    }
    const targetId = encodeBusStopFavoriteId({
      stopUid,
      routeUid: r.routeUid,
      direction: r.direction,
      subRouteName: r.subRouteName,
    });
    const fav = isFavorite(targetId);
    gaClickEvent(fav ? GaEnum.UNFAVORITE_ROUTE : GaEnum.FAVORITE_ROUTE);
    if (fav) {
      removeFavorite(targetId);
    } else if (
      addFavorite({
        targetId,
        // batch 查無此列時的顯示 fallback
        targetName: encodeBusStopFavoriteName(
          r.subRouteName || r.routeName,
          r.destination,
          board.stopName,
        ),
      }) === "limit"
    ) {
      setLimitOpen(true);
    }
  };

  if (board.routes.length === 0) {
    return (
      <>
        <div className="rounded-xl border border-solid border-foreground p-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
          {t("busStopBoardEmpty")}
        </div>
        {/* 查過 TDX 即有廣告：查無路線也顯示（同路線頁無即時） */}
        <div className="mt-2 empty:hidden">
          <AdBanner mode="trainInfo" />
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {board.routes.map((r, index) => {
        const fav =
          showFavoriteRoutes &&
          isFavorite(
            encodeBusStopFavoriteId({
              stopUid,
              routeUid: r.routeUid,
              direction: r.direction,
              subRouteName: r.subRouteName,
            }),
          );
        return (
          <div key={`${r.routeUid}-${r.subRouteName ?? ""}-${r.direction}`}>
            <div className="flex items-center gap-3 rounded-md border border-solid border-foreground px-1.5 py-3">
              {showFavoriteRoutes && (
                <button
                  type="button"
                  aria-label="favorite-toggle"
                  className={`shrink-0 ${
                    fav
                      ? "text-rose-500 dark:text-rose-500/80"
                      : "text-zinc-400 dark:text-zinc-500"
                  }`}
                  onClick={() => handleToggleFavorite(r)}
                >
                  <HeartIcon filled={!!fav} className="ml-2 size-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => onSelectRoute(r)}
                className="custom-cursor-pointer grid flex-1 grid-cols-[1fr_auto] items-center gap-2 text-left"
              >
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className="font-bold">
                    {r.subRouteName || r.routeName}
                  </span>
                  {r.destination && (
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">
                      {t("busTowards", { destination: r.destination })}
                    </span>
                  )}
                </div>
                <BusArrivalBadge
                  state={r.state}
                  estimateMinutes={r.estimateMinutes}
                />
              </button>
            </div>
            {/* 站牌路線清單內插廣告：最多第三筆後，不足三筆遞減（同路線頁） */}
            {AdUtils.showAd(board.routes.length, index) && (
              <div className="mt-2 empty:hidden">
                <AdBanner mode="trainInfo" />
              </div>
            )}
          </div>
        );
      })}

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
        {t("favoriteStopRequiresLogin")}
      </CommonDialog>

      <CommonDialog
        open={limitOpen}
        setOpen={setLimitOpen}
        title="favoriteLimitTitle"
        confirmText="gotItLabel"
      >
        {t("favoriteStopLimitReached")}
      </CommonDialog>
    </div>
  );
};

export default BusStopBoard;
