import { useTranslation } from "next-i18next";
import { FC } from "react";
import { ThsrDailyTimetable } from "../../../models/jsy-thsr-info";
import { getTimeDiff } from "../../../utils/TrainInfoUtils";

interface ThsrTimeInfoMidAreaProps {
  data: ThsrDailyTimetable;
}

const ThsrTimeInfoMidArea: FC<ThsrTimeInfoMidAreaProps> = ({ data }) => {
  const { t } = useTranslation();
  const timeDiff = getTimeDiff(
    data.OriginStopTime.DepartureTime,
    data.DestinationStopTime.ArrivalTime,
    data.TrainDate,
  );

  return (
    <>
      <div>
        {data.OriginStopTime.DepartureTime} -{" "}
        {data.DestinationStopTime.ArrivalTime}
      </div>
      <div className="text-sm text-zinc-500 dark:text-zinc-400">
        {t("trainInfoTimeDiff", { hour: timeDiff.hour, min: timeDiff.min })}
      </div>
    </>
  );
};

export default ThsrTimeInfoMidArea;
