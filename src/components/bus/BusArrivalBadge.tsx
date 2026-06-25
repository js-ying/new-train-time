import { BusArrivalState } from "@/models/jsy-bus-info";
import { useTranslation } from "next-i18next";
import { FC } from "react";

interface BusArrivalBadgeProps {
  state: BusArrivalState;
  estimateMinutes: number | null;
}

/** 各狀態 → i18n key（minutes 另外帶分鐘數插值）。 */
const STATE_LABEL_KEY: Record<BusArrivalState, string> = {
  arriving: "busArriving",
  approaching: "busApproaching",
  minutes: "busMinutes",
  notDeparted: "busNotDeparted",
  trafficControl: "busTrafficControl",
  lastBusPassed: "busLastBusPassed",
  notInService: "busNotInService",
  noData: "busNoData",
};

/** 各狀態 → 文字色（沿用 TrDelay 色票風格）；live 狀態加脈動圓點。 */
const STATE_STYLE: Record<BusArrivalState, { color: string; live: boolean }> = {
  arriving: { color: "text-emerald-600 dark:text-emerald-400", live: true },
  approaching: { color: "text-emerald-600 dark:text-emerald-400", live: true },
  minutes: { color: "text-silverLakeBlue-500 dark:text-gamboge-500", live: false },
  notDeparted: { color: "text-zinc-500 dark:text-zinc-400", live: false },
  trafficControl: { color: "text-amber-600 dark:text-amber-400", live: false },
  lastBusPassed: { color: "text-zinc-400 dark:text-zinc-500", live: false },
  notInService: { color: "text-zinc-400 dark:text-zinc-500", live: false },
  noData: { color: "text-zinc-400 dark:text-zinc-500", live: false },
};

/** [公車] 單站到站狀態徽章：依後端推導的 state 對應 i18n 文字 + 顏色。 */
const BusArrivalBadge: FC<BusArrivalBadgeProps> = ({
  state,
  estimateMinutes,
}) => {
  const { t } = useTranslation();
  const { color, live } = STATE_STYLE[state];

  const label =
    state === "minutes"
      ? t("busMinutes", { minutes: estimateMinutes ?? 0 })
      : t(STATE_LABEL_KEY[state]);

  return (
    <span className={`relative whitespace-nowrap text-sm font-medium ${color}`}>
      {label}
      {live && <span className="dot bg-emerald-600 dark:bg-emerald-400"></span>}
    </span>
  );
};

export default BusArrivalBadge;
