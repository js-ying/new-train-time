import { JsyBusStopArrival } from "@/models/jsy-bus-info";
import { useTranslation } from "next-i18next";
import { FC } from "react";
import BusArrivalBadge from "./BusArrivalBadge";

interface BusStopRowProps {
  stop: JsyBusStopArrival;
}

/** [公車] 單站列：左為順位 + 站名（末班車加標籤），右為到站狀態徽章。沿用 TR 站列卡片樣式。 */
const BusStopRow: FC<BusStopRowProps> = ({ stop }) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-2 rounded-md border border-solid border-foreground p-3">
      <div className="flex items-center gap-2 text-left">
        <span className="min-w-[1.5rem] text-xs tabular-nums text-zinc-400">
          {stop.stopSequence}
        </span>
        <span className="font-medium">{stop.stopName}</span>
        {stop.isLastBus && (
          <span className="rounded bg-amber-100 px-1 text-xs text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
            {t("busLastBus")}
          </span>
        )}
      </div>
      <BusArrivalBadge state={stop.state} estimateMinutes={stop.estimateMinutes} />
    </div>
  );
};

export default BusStopRow;
