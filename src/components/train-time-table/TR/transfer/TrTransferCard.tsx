import ChevronToggleIcon from "@/components/common/ChevronToggleIcon";
import { GaEnum } from "@/enums/GaEnum";
import { JsyTrTransferCombination } from "@/models/jsy-tr-info";
import { gaClickEvent } from "@/utils/GaUtils";
import { getNameLangKey } from "@/utils/LocaleUtils";
import { getTimeDiff, isTrTrainOnlyTicket } from "@/utils/TrainInfoUtils";
import { useTranslation } from "next-i18next";
import { FC, Fragment, useEffect, useMemo, useState } from "react";
import TrTransferLegRow from "./TrTransferLegRow";

interface TrTransferCardProps {
  combination: JsyTrTransferCombination;
  trainDate: string;
  /** 來自父層的展開指令；key 變化時將 local expanded 同步到 value */
  expandSignal?: { value: boolean; key: number } | null;
}

/**
 * 單一轉乘方案卡片：摺疊顯示總覽（段數 / 車種 / 等待時間 / 站徑 / 時段 / 全程），
 * 展開後逐段列出車次並支援點擊開 detail dialog。
 *
 * 排版對齊直達卡片 TrTrainTimeInfo：grid-cols-4，左 1 / 中 2 / 右 1，全 text-sm，
 * 視覺上每張卡片左中右寬度一致。
 */
const TrTransferCard: FC<TrTransferCardProps> = ({
  combination,
  trainDate,
  expandSignal,
}) => {
  const { t, i18n } = useTranslation();
  const langKey = getNameLangKey(i18n.language);
  const [expanded, setExpanded] = useState(false);

  // 父層送出新 signal 時同步；signal.key 變化 effect 才觸發，使用者個別摺收不受干擾
  useEffect(() => {
    if (expandSignal) setExpanded(expandSignal.value);
  }, [expandSignal]);

  const { legs, hubStations, waitMinutes } = combination;
  const firstLeg = legs[0];
  const lastLeg = legs[legs.length - 1];

  // 任一段為需購票車種（自強/普悠瑪/太魯閣）就顯示「需購票」chip
  const hasOnlyTicket = useMemo(
    () => legs.some((l) => isTrTrainOnlyTicket(l.trainInfo.trainTypeCode)),
    [legs],
  );

  // 起 → hub → ... → 終 的站名串，hubStations 已含所有中間轉乘站
  const stationPath = useMemo(() => {
    const stations = [
      firstLeg.boardStopTime.stationName[langKey],
      ...hubStations.map((h) => h[langKey]),
      lastLeg.alightStopTime.stationName[langKey],
    ];
    return stations.join(" ➔ ");
  }, [firstLeg, lastLeg, hubStations, langKey]);

  const timeRange = `${firstLeg.boardStopTime.departureTime} - ${lastLeg.alightStopTime.arrivalTime}`;

  const durationText = useMemo(() => {
    const diff = getTimeDiff(
      firstLeg.boardStopTime.departureTime,
      lastLeg.alightStopTime.arrivalTime,
      trainDate,
    );
    return t("trainInfoTimeDiff", { hour: diff.hour, min: diff.min });
  }, [firstLeg, lastLeg, trainDate, t]);

  // 各段等待時間數值字串：「19 + 45 分」/「26 分」；單位只附加在尾端，多段時不重複
  const waitValue = useMemo(() => {
    const unit = t("minute");
    return `${waitMinutes.join(" + ")} ${unit}`;
  }, [waitMinutes, t]);

  const handleToggle = () => {
    if (!expanded) gaClickEvent(GaEnum.TR_TRANSFER_CARD_EXPAND);
    setExpanded((v) => !v);
  };

  return (
    <div className="rounded-md border border-solid border-foreground p-2">
      <div
        tabIndex={0}
        role="button"
        aria-expanded={expanded}
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggle();
          }
        }}
        className="custom-cursor-pointer grid grid-cols-4 items-center gap-x-3"
      >
        {/* 左：轉乘次數 (= legs.length - 1) / (任一段需購票才出現) 需購票 / 轉乘等待時間 */}
        <div className="flex flex-col items-center gap-1.5 text-center text-sm">
          <span className="rounded bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
            {t("transferLegCount", { count: legs.length - 1 })}
          </span>
          {hasOnlyTicket && (
            <span className="mt-0.5 rounded bg-amber-500 px-2 py-0.5 text-xs text-white dark:bg-amber-500/80">
              {t("transferTicketRequired")}
            </span>
          )}
          {/* 轉乘等待：label 與數值拆兩行，數值可能為 "19 分 + 45 分" */}
          <div className="text-xs text-muted-foreground">
            <div>{t("transferWaitLabel")}</div>
            <div>{waitValue}</div>
          </div>
        </div>

        {/* 中：站徑 / 時段 / 全程 — 仿 TrTimeInfoMidArea 的字體與層級 */}
        <div className="col-span-2 text-center">
          <div className="mb-1 truncate text-sm text-muted-foreground">
            {stationPath}
          </div>
          <div>{timeRange}</div>
          <div className="text-sm text-muted-foreground">{durationText}</div>
        </div>

        {/* 右：展開箭頭 — 靠右但保留一點 padding，避免貼齊卡片邊框 */}
        <div className="flex items-center justify-end pr-2">
          <ChevronToggleIcon expanded={expanded} />
        </div>
      </div>

      {/* 展開：每段 leg + 段間等待 */}
      {expanded && (
        <div className="mt-3 flex flex-col gap-2 border-t border-foreground/20 pt-3">
          {legs.map((leg, i) => (
            <Fragment key={`${leg.trainInfo.trainNo}-${i}`}>
              <TrTransferLegRow leg={leg} trainDate={trainDate} />
              {i < legs.length - 1 && (
                <div className="text-center text-xs text-muted-foreground">
                  {t("transferWaitAt", {
                    station: hubStations[i][langKey],
                    minutes: waitMinutes[i],
                  })}
                </div>
              )}
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrTransferCard;
