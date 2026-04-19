import Dot from "@/components/common/Dot";
import { JsyThsrGeneralTimetable } from "@/models/jsy-thsr-info";
import { getNameLangKey } from "@/utils/LocaleUtils";
import { useTranslation } from "next-i18next";
import { FC } from "react";

interface ThsrStopTimesTableProps {
  data: JsyThsrGeneralTimetable | null;
  startStationId: string;
  endStationId: string;
}

const ThsrStopTimesTable: FC<ThsrStopTimesTableProps> = ({
  data,
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
              className="border- flex-1 border-y border-silverLakeBlue-500 py-2 text-center text-silverLakeBlue-500 dark:border-gamboge-500 dark:text-gamboge-500"
              key={title}
            >
              {t(title)}
            </div>
          );
        })}
      </div>
      {data?.stopTimes.map((stopTime) => {
        return (
          <div
            className={`mt-2 flex ${
              [startStationId, endStationId].includes(stopTime.stationId)
                ? "font-bold text-silverLakeBlue-500 dark:text-gamboge-500"
                : ""
            }`}
            key={stopTime.stationId}
          >
            <div className="relative flex-1 text-center">
              {[startStationId, endStationId].includes(stopTime.stationId) && (
                <Dot />
              )}
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

export default ThsrStopTimesTable;
