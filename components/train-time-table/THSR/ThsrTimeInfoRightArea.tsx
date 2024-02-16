import { useTranslation } from "next-i18next";
import { FC } from "react";
import { ThsrDailyFreeSeatingCar } from "../../../types/thsr-train-time-table";
import ThsrFreeSeat from "./ThsrFreeSeat";

interface ThsrTimeInfoRightAreaProps {
  trainNo: string;
  freeSeatData: ThsrDailyFreeSeatingCar;
}

const ThsrTimeInfoRightArea: FC<ThsrTimeInfoRightAreaProps> = ({
  trainNo,
  freeSeatData,
}) => {
  const { t } = useTranslation();

  return (
    <div className="text-sm">
      <div className="mb-1">{t("freeSeating")}</div>

      <ThsrFreeSeat freeSeatData={freeSeatData} trainNo={trainNo} />
    </div>
  );
};

export default ThsrTimeInfoRightArea;
