import { BusSource, JsyBusStopArrival } from "@/models/jsy-bus-info";
import { useTranslation } from "next-i18next";
import { FC } from "react";
import BusArrivalBadge from "./BusArrivalBadge";

interface BusStopRowProps {
  stop: JsyBusStopArrival;
  /** 路線來源；判可點：市區公車站需 city 有值（在 bus_stop）才查得到，公路客運/台灣好行 StopUID 直查、一律可點。 */
  source?: BusSource;
  /** 點站 → 跳該站牌看板（StopUID 為錨）。 */
  onSelectStop?: (stop: JsyBusStopArrival) => void;
}

/**
 * [公車] 單站列：左為順位 + 站名（末班車加標籤），右為到站狀態徽章。沿用 TR 站列卡片樣式。
 * 可點則跳該站牌看板查該站所有路線；不可點站維持純展示。
 */
const BusStopRow: FC<BusStopRowProps> = ({ stop, source, onSelectStop }) => {
  const { t } = useTranslation();
  const clickable = !!onSelectStop && (source !== "city" || !!stop.city);

  const base =
    "grid grid-cols-[1fr_auto] items-center gap-2 rounded-md border border-solid border-foreground p-3";

  const inner = (
    <>
      <div className="flex items-center gap-2 text-left">
        <span className="min-w-[1.5rem] text-xs tabular-nums text-zinc-400">
          {stop.stopSequence}
        </span>
        <span className="font-medium">{stop.stopName}</span>
        {stop.isLastBus && (
          <span className="rounded bg-amber-100 px-1 text-xs text-amber-600 dark:bg-amber-600/40 dark:text-amber-300">
            {t("busLastBus")}
          </span>
        )}
      </div>
      <BusArrivalBadge
        state={stop.state}
        estimateMinutes={stop.estimateMinutes}
      />
    </>
  );

  if (clickable) {
    return (
      <button
        type="button"
        onClick={() => onSelectStop?.(stop)}
        aria-label={t("busViewStopRoutes", { stop: stop.stopName })}
        className={`custom-cursor-pointer w-full text-left ${base}`}
      >
        {inner}
      </button>
    );
  }

  return <div className={base}>{inner}</div>;
};

export default BusStopRow;
