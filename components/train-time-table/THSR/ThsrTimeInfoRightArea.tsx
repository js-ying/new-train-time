import { useTranslation } from "next-i18next";
import { ThsrDailyFreeSeatingCar } from "../../../types/thsr-train-time-table";
import ThsrFreeSeat from "./ThsrFreeSeat";

const ThsrTimeInfoRightArea = ({
  trainNo,
  freeSeatData,
}: {
  trainNo: string;
  freeSeatData: ThsrDailyFreeSeatingCar;
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
