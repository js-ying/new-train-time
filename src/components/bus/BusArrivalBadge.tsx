import { BusArrivalState } from "@/models/jsy-bus-info";
import { useTranslation } from "next-i18next";
import { FC } from "react";

interface BusArrivalBadgeProps {
  state: BusArrivalState;
  estimateMinutes: number | null;
  /** 起站未發車時的下一班發車時刻（HH:mm）；有值則取代「尚未發車」顯示。 */
  nextDepartTime?: string;
}

/** 各狀態 → i18n key（minutes 單獨渲染數字+單位，不走此表）。 */
const STATE_LABEL_KEY: Record<BusArrivalState, string> = {
  arriving: "busArriving",
  approaching: "busApproaching",
  minutes: "busMinuteUnit",
  notDeparted: "busNotDeparted",
  trafficControl: "busTrafficControl",
  lastBusPassed: "busLastBusPassed",
  notInService: "busNotInService",
  noData: "busNoData",
};

/** 各狀態 → 文字色（沿用 TrDelay 色票風格）；分鐘數用一般前景色，靠數字大小凸顯。 */
const STATE_COLOR: Record<BusArrivalState, string> = {
  // 進站中＝車已到，用紅色凸顯急迫；即將到站維持綠色（綠→紅遞進）
  arriving: "text-red-600 dark:text-red-400",
  approaching: "text-emerald-600 dark:text-emerald-400",
  minutes: "text-foreground",
  notDeparted: "text-zinc-500 dark:text-zinc-400",
  trafficControl: "text-amber-600 dark:text-amber-400",
  lastBusPassed: "text-zinc-400 dark:text-zinc-500",
  notInService: "text-zinc-400 dark:text-zinc-500",
  noData: "text-zinc-400 dark:text-zinc-500",
};

/** [公車] 單站到站狀態徽章：依後端推導的 state 對應 i18n 文字 + 顏色。 */
const BusArrivalBadge: FC<BusArrivalBadgeProps> = ({
  state,
  estimateMinutes,
  nextDepartTime,
}) => {
  const { t } = useTranslation();
  const color = STATE_COLOR[state];
  const base = "inline-flex min-w-20 justify-center whitespace-nowrap";

  // 起站未發車且班表有下一班 → 顯示發車時刻（資訊比「尚未發車」多）；用一般前景色與「X 分」一致
  if (state === "notDeparted" && nextDepartTime) {
    return (
      <span
        className={`${base} text-sm font-medium tabular-nums ${STATE_COLOR.minutes}`}
      >
        {nextDepartTime}
      </span>
    );
  }

  // 「X 分」：分鐘數放大、單位維持小字，整體用一般色
  if (state === "minutes") {
    return (
      <span className={`${base} items-baseline font-medium ${color}`}>
        <span className="text-lg font-semibold tabular-nums">
          {estimateMinutes ?? 0}
        </span>
        <span className="ml-1 text-sm">{t("busMinuteUnit")}</span>
      </span>
    );
  }

  return (
    <span className={`${base} text-sm font-medium ${color}`}>
      {t(STATE_LABEL_KEY[state])}
    </span>
  );
};

export default BusArrivalBadge;
