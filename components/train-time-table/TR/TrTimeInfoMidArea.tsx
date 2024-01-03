import { useTranslation } from "next-i18next";
import { useContext } from "react";
import { SearchAreaContext } from "../../../contexts/SearchAreaContext";
import { TrTrainTimeTable } from "../../../types/tr-train-time-table";
import { getTimeDiff } from "../../../utils/train-info-utils";
import TrDelay from "./TrDelay";

const TrTimeInfoMidArea = ({
  data,
  lang,
}: {
  data: TrTrainTimeTable;
  lang: string;
}) => {
  const { t } = useTranslation();
  const params = useContext(SearchAreaContext);
  const timeDiff = getTimeDiff(
    data.StopTimes[0].DepartureTime,
    data.StopTimes[data.StopTimes.length - 1].ArrivalTime,
    params.date,
  );

  return (
    <>
      <TrDelay data={data.delayInfo} />
      <div>
        {data.StopTimes[0].DepartureTime} -{" "}
        {data.StopTimes[data.StopTimes.length - 1].ArrivalTime}
      </div>
      <div className="text-sm text-zinc-500 dark:text-zinc-400">
        {t("trainInfoTimeDiff", { hour: timeDiff.hour, min: timeDiff.min })}
      </div>
    </>
  );
};

export default TrTimeInfoMidArea;
