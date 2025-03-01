import { useTranslation } from "next-i18next";
import { FC } from "react";
import { JsyTrTrainTimeTable } from "../../../models/tr-train-time-table";
import { getTimeDiff } from "../../../utils/TrainInfoUtils";
import TrDelay from "./TrDelay";

interface TrTimeInfoMidAreaProps {
  data: JsyTrTrainTimeTable;
}

const TrTimeInfoMidArea: FC<TrTimeInfoMidAreaProps> = ({ data }) => {
  const { t } = useTranslation();
  const timeDiff = getTimeDiff(
    data.StopTimes[0].DepartureTime,
    data.StopTimes[data.StopTimes.length - 1].ArrivalTime,
    data.trainDate,
  );

  return (
    <>
      <TrDelay dataList={data.delayInfo} />
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
