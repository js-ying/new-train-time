import Dot from "@/components/common/Dot";
import { JsyTrTimetable } from "@/models/jsy-tr-info";

import { getNameLangKey } from "@/utils/LocaleUtils";
import { useTranslation } from "next-i18next";
import { FC } from "react";

interface TrStopTimesTableProps {
  data: JsyTrTimetable;
}

const TrStopTimesTable: FC<TrStopTimesTableProps> = ({ data }) => {
  const { t, i18n } = useTranslation();
  const langKey = getNameLangKey(i18n.language);

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
      {data.stopTimes.map((stopTime, index) => {
        return (
          <div
            className={`mt-2 flex ${
              index === 0 || index === data.stopTimes.length - 1
                ? "font-bold text-primary"
                : ""
            }`}
            key={stopTime.stationId}
          >
            <div className="relative flex-1 text-center">
              {(index === 0 || index === data.stopTimes.length - 1) && <Dot />}
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
