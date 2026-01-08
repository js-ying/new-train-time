import { JsyTimeTable } from "@/models/jsy-thsr-info";
import { useTranslation } from "next-i18next";
import { FC } from "react";
import ThsrOrderButton from "./ThsrOrderButton";

interface ThsrAvailableSeatStatusProps {
  timeTable: JsyTimeTable;
}

const ThsrAvailableSeatStatus: FC<ThsrAvailableSeatStatusProps> = ({
  timeTable,
}) => {
  const { t } = useTranslation();
  const standardSeatStatus = timeTable.standardSeatStatus;
  const businessSeatStatus = timeTable.businessSeatStatus;

  if (
    (standardSeatStatus === null && businessSeatStatus === null) ||
    (standardSeatStatus === "X" && businessSeatStatus === "X")
  ) {
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
    <div className="flex flex-col items-center gap-1">
      <ThsrOrderButton timeTable={timeTable} />
      {statusText && <span className="">{statusText}</span>}
    </div>
  );
};

export default ThsrAvailableSeatStatus;
