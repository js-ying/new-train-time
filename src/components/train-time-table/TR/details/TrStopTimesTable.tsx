import Dot from "@/components/common/Dot";
import { JsyTrTimetable } from "@/models/jsy-tr-info";

import { getNameLangKey } from "@/utils/LocaleUtils";
import { useTranslation } from "next-i18next";
import { FC, useMemo } from "react";

interface TrStopTimesTableProps {
  data: JsyTrTimetable;
  /**
   * 要強調（粗體 + 端點 Dot）的站 stationId。
   * 不傳 → 預設頭尾兩站（OD 直達：stopTimes 已裁到查詢起迄，頭尾即起迄站）。
   * 轉乘 leg 傳該段上/下車站；單站時刻表傳查詢站（停靠表為該車完整路徑，頭尾≠強調點）。
   */
  highlightStationIds?: string[];
}

const TrStopTimesTable: FC<TrStopTimesTableProps> = ({
  data,
  highlightStationIds,
}) => {
  const { t, i18n } = useTranslation();
  const langKey = getNameLangKey(i18n.language);

  // 未指定時 fallback 頭尾（維持 OD 既有行為）
  const highlightSet = useMemo(() => {
    if (highlightStationIds) return new Set(highlightStationIds);
    const stops = data.stopTimes;
    return new Set(
      stops.length > 0
        ? [stops[0].stationId, stops[stops.length - 1].stationId]
        : [],
    );
  }, [highlightStationIds, data.stopTimes]);

  return (
    <>
      <div className="flex font-bold">
        {["stationName", "arrivalTime", "leaveTime"].map((title) => {
          return (
            <div
              className="flex-1 border-y border-primary py-2 text-center text-primary"
              key={title}
            >
              {t(title)}
            </div>
          );
        })}
      </div>
      {data.stopTimes.map((stopTime) => {
        const isHighlight = highlightSet.has(stopTime.stationId);
        return (
          <div
            className={`mt-2 flex ${isHighlight ? "font-bold text-primary" : ""}`}
            key={stopTime.stationId}
          >
            <div className="relative flex-1 text-center">
              {isHighlight && <Dot />}
              {stopTime.stationName[langKey]}
            </div>
            <div className="flex-1 text-center">{stopTime.arrivalTime}</div>
            <div className="flex-1 text-center">{stopTime.departureTime}</div>
          </div>
        );
      })}
    </>
  );
};

export default TrStopTimesTable;
