import HeartIcon from "@/components/icons/HeartIcon";
import useBusFavoriteStopBoards from "@/hooks/search/useBusFavoriteStopBoards";
import useBusName from "@/hooks/useBusName";
import { JsyBusStopBoardsBatchItem } from "@/models/jsy-bus-info";
import { StationFavorite } from "@/models/station-favorites";
import {
  encodeBusStopFavoriteId,
  parseBusStopFavoriteId,
  parseBusStopFavoriteName,
} from "@/utils/BusStopFavoriteUtils";
import { useTranslation } from "next-i18next";
import { FC, useMemo } from "react";
import BusArrivalBadge from "./BusArrivalBadge";
import BusAutoRefreshRing from "./BusAutoRefreshRing";

interface BusFavoriteStopBoardProps {
  /** BUS_STOP 收藏（呼叫端已過濾為有效三元組），順序即顯示順序。 */
  favorites: StationFavorite[];
  /** 點某列 → 跳該站牌看板。 */
  onSelect: (stopUid: string) => void;
  /** 點愛心 → 移除該筆收藏。 */
  onRemove: (targetId: string) => void;
}

/**
 * [公車] 收藏站點看板：各收藏（站牌×路線×方向）的即時到站卡片。
 * 顯示以 batch 回應權威值優先，該站此刻查無該路線列時退回收藏時的 targetName 快照。
 */
const BusFavoriteStopBoard: FC<BusFavoriteStopBoardProps> = ({
  favorites,
  onSelect,
  onRemove,
}) => {
  const { t } = useTranslation();
  const busName = useBusName();

  const keys = useMemo(
    () =>
      favorites
        .map((f) => parseBusStopFavoriteId(f.targetId))
        .filter((k): k is NonNullable<typeof k> => k !== null),
    [favorites],
  );
  const {
    data,
    error,
    isAutoRefresh,
    nextUpdateAt,
    pollIntervalMs,
    isIdle,
    resumeAutoRefresh,
  } = useBusFavoriteStopBoards(keys);

  // 以 targetId 對回收藏列（防收藏增減瞬間錯位）
  const itemById = useMemo(() => {
    const m = new Map<string, JsyBusStopBoardsBatchItem>();
    for (const it of data?.items ?? []) m.set(encodeBusStopFavoriteId(it), it);
    return m;
  }, [data]);

  // 任一站牌看板 stale 或更新失敗時標示資料時間
  const staleWarning =
    data != null && (data.isStale || error != null)
      ? t("busStaleDataWarning", {
          time: new Date(data.updatedAt).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        })
      : null;

  return (
    <div className="flex w-full flex-col gap-3">
      {/* idle 暫停時顯示恢復提示條，否則顯示輪詢倒數環 */}
      {isIdle ? (
        <button
          type="button"
          onClick={resumeAutoRefresh}
          className="custom-cursor-pointer rounded-md border border-solid border-foreground p-2 text-center text-xs text-muted-foreground"
        >
          {t("autoRefreshIdleMsg")}
        </button>
      ) : (
        isAutoRefresh &&
        nextUpdateAt != null && (
          <div className="flex justify-center pb-1.5">
            <BusAutoRefreshRing
              nextUpdateAt={nextUpdateAt}
              intervalMs={pollIntervalMs}
            />
          </div>
        )
      )}
      {staleWarning && (
        <div className="text-center text-xs text-warning">{staleWarning}</div>
      )}

      {favorites.map((fav) => {
        const key = parseBusStopFavoriteId(fav.targetId);
        if (!key) return null;
        const row = itemById.get(fav.targetId);
        const snapshot = parseBusStopFavoriteName(fav.targetName);
        // batch 查無該列時退收藏快照（快照為收藏當下語系，無中英兩版）
        const routeLabel = row
          ? busName(row.subRouteName || row.routeName, row.routeNameEn)
          : snapshot.routeLabel;
        const destination = row?.destination
          ? busName(row.destination, row.destinationEn)
          : snapshot.destination;
        const stopName = row?.stopName
          ? busName(row.stopName, row.stopNameEn)
          : snapshot.stopName;
        return (
          <div
            key={fav.targetId}
            className="flex items-center gap-3 rounded-md border border-solid border-foreground p-3"
          >
            {/* 愛心＝移除此收藏（恆實心） */}
            <button
              type="button"
              aria-label="favorite-remove"
              className="shrink-0 text-rose-500 dark:text-rose-500/80"
              onClick={() => onRemove(fav.targetId)}
            >
              <HeartIcon filled className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => onSelect(key.stopUid)}
              className="custom-cursor-pointer grid flex-1 grid-cols-[1fr_auto] items-center gap-2 text-left"
            >
              <div>
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className="font-bold">{routeLabel}</span>
                  {destination && (
                    <span className="text-sm text-muted-foreground">
                      {t("busTowards", { destination })}
                    </span>
                  )}
                </div>
                <div className="mt-0.5 text-sm">{stopName}</div>
              </div>
              <BusArrivalBadge
                state={row?.state ?? "noData"}
                estimateMinutes={row?.estimateMinutes ?? null}
              />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default BusFavoriteStopBoard;
