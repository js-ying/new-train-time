import TrTrainTimeDetailDialog from "@/components/train-time-table/TR/TrTrainTimeDetailDialog";
import { GaEnum } from "@/enums/GaEnum";
import { JsyTrTimetable, JsyTrTransferLeg } from "@/models/jsy-tr-info";
import { gaClickEvent } from "@/utils/GaUtils";
import { getNameLangKey } from "@/utils/LocaleUtils";
import { getTrTrainTypeNameByCode } from "@/utils/TrainInfoUtils";
import { useTranslation } from "next-i18next";
import { FC, useMemo, useState } from "react";
import TrTrainType from "../TrTrainType";
import TrTripLine from "../TrTripLine";

interface TrTransferLegRowProps {
  leg: JsyTrTransferLeg;
  trainDate: string;
}

/**
 * 轉乘卡片展開後的單段列車 row。
 * 排版對齊直達卡片 TrTrainTimeInfo（grid-cols-4，左 1 / 中 2 / 右 1），
 * 但壓縮為 2 行高度（不顯示整列車起迄站，因為使用者實際只搭該段）。
 * 點擊把 leg 包裝成 JsyTrTimetable（票價對應該段 board→alight OD；delayInfo 留空）開既有 detail dialog。
 */
const TrTransferLegRow: FC<TrTransferLegRowProps> = ({ leg, trainDate }) => {
  const [open, setOpen] = useState(false);
  const { i18n } = useTranslation();
  const langKey = getNameLangKey(i18n.language);

  // 把 leg 包成 dialog 期待的 JsyTrTimetable 形狀；fare 為 null 時保持空陣列，detail dialog 會略過票價列
  const pseudoTimetable: JsyTrTimetable = useMemo(
    () => ({
      trainInfo: leg.trainInfo,
      stopTimes: leg.stopTimes,
      fareList: leg.fare ? [leg.fare] : [],
      delayInfo: [],
      trainDate,
    }),
    [leg, trainDate],
  );

  const trainTypeName = getTrTrainTypeNameByCode(
    leg.trainInfo.trainTypeCode,
    i18n.language,
  );

  const handleClick = () => {
    gaClickEvent(GaEnum.TR_TRANSFER_LEG_INFO);
    setOpen(true);
  };

  return (
    <>
      <div
        tabIndex={0}
        role="button"
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
        className="custom-cursor-pointer grid grid-cols-4 items-center gap-x-3 rounded-md border border-solid border-foreground/40 p-2"
      >
        {/* 左：車號+山線 / 車種 chip — 2 行壓縮版（不放起迄站） */}
        <div className="flex flex-col items-center gap-1 text-center text-sm">
          <TrTripLine
            trainNo={leg.trainInfo.trainNo}
            tripLine={leg.trainInfo.tripLine}
          />
          <TrTrainType
            code={leg.trainInfo.trainTypeCode}
            trainTypeName={trainTypeName}
          />
        </div>

        {/* 中：上下車站名 / 上下車時刻 — 2 行對齊直達 TrTimeInfoMidArea */}
        <div className="col-span-2 text-center text-sm">
          <div className="truncate">
            {leg.boardStopTime.stationName[langKey]}
            {" → "}
            {leg.alightStopTime.stationName[langKey]}
          </div>
          <div className="text-muted-foreground">
            {leg.boardStopTime.departureTime}
            {" - "}
            {leg.alightStopTime.arrivalTime}
          </div>
        </div>

        {/* 右：保留空 col 對齊 grid-cols-4，讓中間欄真正置中 */}
        <div />
      </div>

      <TrTrainTimeDetailDialog
        open={open}
        setOpen={setOpen}
        data={pseudoTimetable}
      />
    </>
  );
};

export default TrTransferLegRow;
