import Dot from "@/components/common/Dot";
import { ThsrGeneralTimeTable } from "@/models/jsy-thsr-info";
import { getTdxLang } from "@/utils/LocaleUtils";
import { useTranslation } from "next-i18next";
import { FC } from "react";

interface ThsrStopTimesTableProps {
  data: ThsrGeneralTimeTable | null;
  startStationId: string;
  endStationId: string;
}

const ThsrStopTimesTable: FC<ThsrStopTimesTableProps> = ({
  data,
  startStationId,
  endStationId,
}) => {
  const { t, i18n } = useTranslation();

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
      {data?.StopTimes.map((stopTime) => {
        return (
          <div
            className={`mt-2 flex ${
              [startStationId, endStationId].includes(stopTime.StationID)
                ? "font-bold text-silverLakeBlue-500 dark:text-gamboge-500"
                : ""
            }`}
            key={stopTime.StationID}
          >
            <div className="relative flex-1 text-center">
              {[startStationId, endStationId].includes(stopTime.StationID) && (
                <Dot />
              )}
              {stopTime.StationName[getTdxLang(i18n.language)]}
            </div>
            <div className="flex-1 text-center">{stopTime.ArrivalTime}</div>
            <div className="flex-1 text-center">{stopTime.DepartureTime}</div>
          </div>
        );
      })}
    </>
  );
};

export default ThsrStopTimesTable;
