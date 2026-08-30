import AdBanner from "@/components/common/AdBanner";
import CommonDialog from "@/components/common/CommonDialog";
import HeartIcon from "@/components/icons/HeartIcon";
import { useAuth } from "@/contexts/AuthContext";
import { GaEnum } from "@/enums/GaEnum";
import useBusName from "@/hooks/useBusName";
import useSetting from "@/hooks/useSetting";
import useStationFavorites from "@/hooks/useStationFavorites";
import { JsyBusStopBoard, JsyBusStopBoardRoute } from "@/models/jsy-bus-info";
import AdUtils from "@/utils/AdUtils";
import {
  BusStopFavoriteKey,
  encodeBusStopFavoriteId,
  encodeBusStopFavoriteName,
} from "@/utils/BusStopFavoriteUtils";
import { gaClickEvent } from "@/utils/GaUtils";
import { useTranslation } from "next-i18next";
import { FC, useEffect, useRef, useState } from "react";
import BusArrivalBadge from "./BusArrivalBadge";

interface BusStopBoardProps {
  board: JsyBusStopBoard;
  /** 當前柱 StopUID（列愛心收藏的三元組錨；同名多柱時各柱收藏各自獨立）。 */
  stopUid: string;
  /** 點某路線 → 跳該路線看板（帶 routeUid + board 所在縣市）。 */
  onSelectRoute: (route: JsyBusStopBoardRoute) => void;
  /** 從收藏點入時要標記的那一列（stopUid 不符即忽略，防返回上頁殘留）。 */
  highlight?: BusStopFavoriteKey | null;
  /** highlight 已處理（不論找不找得到列），請呼叫端清掉。 */
  onHighlightApplied?: () => void;
}

/** 列 key＝路線×子線×方向，與收藏三元組同粒度 */
const rowKey = (r: {
  routeUid: string;
  subRouteName?: string;
  direction: number;
}): string => `${r.routeUid}-${r.subRouteName ?? ""}-${r.direction}`;

/** 高亮持續毫秒（.stop-highlight 動畫 1.2s × 2 輪） */
const HIGHLIGHT_DURATION_MS = 2400;

/**
 * [公車] 站牌即時看板：列出該站牌所有路線的到站（可點進路線看板），依到站排序。
 * 每列愛心＝收藏該（站牌×路線×方向）到站（BUS_STOP 分組）。
 */
const BusStopBoard: FC<BusStopBoardProps> = ({
  board,
  stopUid,
  onSelectRoute,
  highlight,
  onHighlightApplied,
}) => {
  const { t } = useTranslation();
  const busName = useBusName();
  const { user, loginWithGoogle } = useAuth();
  const { limit, addFavorite, removeFavorite, isFavorite } =
    useStationFavorites("BUS_STOP");
  const [showFavoriteStops] = useSetting("showFavoriteStops");

  const [loginOpen, setLoginOpen] = useState(false);
  const [limitOpen, setLimitOpen] = useState(false);

  // 收藏點入的標記列：捲到畫面中央並亮邊框，逾時自動熄
  const rowRefs = useRef(new Map<string, HTMLDivElement>());
  const glowTimer = useRef<ReturnType<typeof setTimeout>>();
  const [glowKey, setGlowKey] = useState<string | null>(null);
  useEffect(() => () => clearTimeout(glowTimer.current), []);
  useEffect(() => {
    if (!highlight || highlight.stopUid !== stopUid) return;
    onHighlightApplied?.();
    const key = rowKey(highlight);
    const el = rowRefs.current.get(key);
    if (!el) return; // 該站此刻查無此路線列（TDX 未回）→ 只是不捲
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    setGlowKey(key);
    clearTimeout(glowTimer.current);
    glowTimer.current = setTimeout(
      () => setGlowKey(null),
      HIGHLIGHT_DURATION_MS,
    );
  }, [highlight, stopUid, onHighlightApplied]);

  // 子線列顯示子線名，英文用 routeNameEn（已是該子線英文）
  const routeLabel = (r: JsyBusStopBoardRoute): string =>
    busName(r.subRouteName || r.routeName, r.routeNameEn);

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
        // 顯示快照存當前語系所見（batch 查無列時原樣顯示）
        targetName: encodeBusStopFavoriteName(
          routeLabel(r),
          busName(r.destination, r.destinationEn),
          busName(board.stopName, board.stopNameEn),
        ),
      }) === "limit"
    ) {
      setLimitOpen(true);
    }
  };

  if (board.routes.length === 0) {
    return (
      <>
        <div className="rounded-xl border border-solid border-foreground p-4 text-center text-sm text-muted-foreground">
          {t("busStopBoardEmpty")}
        </div>
        {/* 查過 TDX 即有廣告：查無路線也顯示（同路線頁無即時） */}
        <div className="mt-4 empty:hidden">
          <AdBanner mode="trainInfo" />
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {board.routes.map((r, index) => {
        const key = rowKey(r);
        const fav =
          showFavoriteStops &&
          isFavorite(
            encodeBusStopFavoriteId({
              stopUid,
              routeUid: r.routeUid,
              direction: r.direction,
              subRouteName: r.subRouteName,
            }),
          );
        return (
          <div key={key}>
            <div
              ref={(el) => {
                if (el) rowRefs.current.set(key, el);
                else rowRefs.current.delete(key);
              }}
              className={`flex items-center gap-3 rounded-md border border-solid p-3 transition-colors ${
                glowKey === key ? "stop-highlight" : "border-foreground"
              }`}
            >
              {showFavoriteStops && (
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
                  <HeartIcon filled={!!fav} className="size-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => onSelectRoute(r)}
                className="custom-cursor-pointer grid flex-1 grid-cols-[1fr_auto] items-center gap-2 text-left"
              >
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className="font-bold">{routeLabel(r)}</span>
                  {r.destination && (
                    <span className="text-sm text-muted-foreground">
                      {t("busTowards", {
                        destination: busName(r.destination, r.destinationEn),
                      })}
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
              <div className="mt-3 empty:hidden">
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
        {t("favoriteStopLimitReached", { max: limit })}
      </CommonDialog>
    </div>
  );
};

export default BusStopBoard;
