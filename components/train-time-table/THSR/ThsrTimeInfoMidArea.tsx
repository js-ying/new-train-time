import { useTranslation } from "next-i18next";
import { useContext } from "react";
import { SearchAreaContext } from "../../../contexts/SearchAreaContext";
import { ThsrDailyTimetable } from "../../../types/thsr-train-time-table";
import { getTimeDiff } from "../../../utils/train-info-utils";

const ThsrTimeInfoMidArea = ({ data }: { data: ThsrDailyTimetable }) => {
  const { t } = useTranslation();
  const params = useContext(SearchAreaContext);
  const timeDiff = getTimeDiff(
    data.OriginStopTime.DepartureTime,
    data.DestinationStopTime.ArrivalTime,
    params.date,
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
