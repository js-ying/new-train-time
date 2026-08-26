import HeartIcon from "@/components/icons/HeartIcon";
import { BusSource, JsyBusStopArrival } from "@/models/jsy-bus-info";
import useBusName from "@/hooks/useBusName";
import { useTranslation } from "next-i18next";
import { FC } from "react";
import BusArrivalBadge from "./BusArrivalBadge";

interface BusStopRowProps {
  stop: JsyBusStopArrival;
  /** 路線來源；判可點：市區公車站需 city 有值（在 bus_stop）才查得到，公路客運/台灣好行 StopUID 直查、一律可點。 */
  source?: BusSource;
  /** 點站 → 跳該站牌看板（StopUID 為錨）。 */
  onSelectStop?: (stop: JsyBusStopArrival) => void;
  /** 收藏愛心（站點三元組：本站×本路線×當前方向）；未提供則不顯示。 */
  favorite?: { isFavorited: boolean; onToggle: () => void };
}

/**
 * [公車] 單站列：序號 + 收藏愛心 + 站名（末班車加標籤）+ 到站徽章。
 * 可點則跳該站牌看板查該站所有路線；不可點站維持純展示。
 */
const BusStopRow: FC<BusStopRowProps> = ({
  stop,
  source,
  onSelectStop,
  favorite,
}) => {
  const { t } = useTranslation();
  const busName = useBusName();
  const clickable = !!onSelectStop && (source !== "city" || !!stop.city);
  const stopName = busName(stop.stopName, stop.stopNameEn);

  const content = (
    <div className="grid w-full grid-cols-[1fr_auto] items-center gap-2">
      <div className="flex items-center gap-2 text-left">
        <span className="font-medium">{stopName}</span>
        {stop.isLastBus && (
          <span className="rounded bg-amber-100 px-1 text-xs text-amber-600 dark:bg-amber-600/40 dark:text-amber-300">
            {t("busLastBus")}
          </span>
        )}
      </div>
      <BusArrivalBadge
        state={stop.state}
        estimateMinutes={stop.estimateMinutes}
        nextDepartTime={stop.nextDepartTime}
      />
    </div>
  );

  return (
    <div className="flex items-center gap-1.5 rounded-md border border-solid border-foreground p-3">
      <span className="w-5 shrink-0 text-center text-xs tabular-nums text-zinc-400">
        {stop.stopSequence}
      </span>
      {favorite && (
        <button
          type="button"
          aria-label="favorite-toggle"
          className={`shrink-0 ${
            favorite.isFavorited
              ? "text-rose-500 dark:text-rose-500/80"
              : "text-zinc-400 dark:text-zinc-500"
          }`}
          onClick={favorite.onToggle}
        >
          <HeartIcon filled={favorite.isFavorited} className="size-4" />
        </button>
      )}
      {clickable ? (
        <button
          type="button"
          onClick={() => onSelectStop?.(stop)}
          aria-label={t("busViewStopRoutes", { stop: stopName })}
          className="custom-cursor-pointer flex-1 text-left"
        >
          {content}
        </button>
      ) : (
        <div className="flex-1">{content}</div>
      )}
    </div>
  );
};

export default BusStopRow;
