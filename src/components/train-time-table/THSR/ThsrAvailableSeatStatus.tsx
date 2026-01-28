import { ThsrDailyTimetable } from "@/models/jsy-thsr-info";

import { useTranslation } from "next-i18next";
import { FC } from "react";

interface ThsrAvailableSeatStatusProps {
  timeTable: ThsrDailyTimetable;
}

/**
 * 判斷是否有剩餘座位
 */
export const isThsrAvailable = (timeTable: ThsrDailyTimetable) => {
  const standardSeatStatus = timeTable.jsyStandardSeatStatus;
  const businessSeatStatus = timeTable.jsyBusinessSeatStatus;

  return !(
    (standardSeatStatus === null && businessSeatStatus === null) ||
    (standardSeatStatus === "X" && businessSeatStatus === "X")
  );
};

/**
 * 判斷是否「僅剩」商務車廂座位
 */
export const isOnlyBusinessAvailable = (timeTable: ThsrDailyTimetable) => {
  return (
    timeTable.jsyStandardSeatStatus === "X" &&
    timeTable.jsyBusinessSeatStatus !== "X"
  );
};

const ThsrAvailableSeatStatus: FC<ThsrAvailableSeatStatusProps> = ({
  timeTable,
}) => {
  const { t } = useTranslation();
  const standardSeatStatus = timeTable.jsyStandardSeatStatus;
  const businessSeatStatus = timeTable.jsyBusinessSeatStatus;

  if (!isThsrAvailable(timeTable)) {
    return <div className="">{t("noAvailableSeats")}</div>;
  }

  const getSeatStatusText = () => {
    if (standardSeatStatus !== "X" && businessSeatStatus !== "X") {
      return t("regularBusinessSeat");
    }
    if (standardSeatStatus !== "X") {
      return t("regularSeat");
    }
    if (businessSeatStatus !== "X") {
      return t("businessSeat");
    }
    return "";
  };

  const statusText = getSeatStatusText();

  return (
    <div className="flex flex-col items-center">
      {statusText && <span className="">{statusText}</span>}
    </div>
  );
};

export default ThsrAvailableSeatStatus;
