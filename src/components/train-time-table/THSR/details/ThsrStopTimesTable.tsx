import Dot from "@/components/common/Dot";
import { JsyThsrTrainStopTime } from "@/models/jsy-thsr-info";
import { getNameLangKey } from "@/utils/LocaleUtils";
import { useTranslation } from "next-i18next";
import { FC } from "react";

interface ThsrStopTimesTableProps {
  stopTimes: JsyThsrTrainStopTime[];
  startStationId: string;
  endStationId: string;
}

const ThsrStopTimesTable: FC<ThsrStopTimesTableProps> = ({
  stopTimes,
  startStationId,
  endStationId,
}) => {
  const { t, i18n } = useTranslation();
  const langKey = getNameLangKey(i18n.language);

  return (
    <>
      <div className="flex font-bold">
        {["stationName", "arrivalTime", "leaveTime"].map((title) => {
          return (
            <div
              className="flex flex-1 items-center justify-center border-y border-primary py-2 text-center text-primary"
              key={title}
            >
              {t(title)}
            </div>
          );
        })}
      </div>
      {stopTimes.map((stopTime) => {
        const isHighlight = [startStationId, endStationId].includes(
          stopTime.stationId,
        );
        return (
          <div
            className={`mt-2 flex ${isHighlight ? "font-bold text-primary" : ""}`}
            key={stopTime.stationId}
          >
            {/* 右側透明 Dot 對稱佔位，讓站名維持置中 */}
            <div className="flex flex-1 items-center justify-center gap-1.5">
              {isHighlight && <Dot />}
              <span className="text-center">
                {stopTime.stationName[langKey]}
              </span>
              {isHighlight && <Dot className="invisible" />}
            </div>
            <div className="flex-1 text-center">{stopTime.arrivalTime}</div>
            <div className="flex-1 text-center">{stopTime.departureTime}</div>
          </div>
        );
      })}
    </>
  );
};

export default ThsrStopTimesTable;
