import { JsyTimeTable } from "@/models/jsy-thsr-info";
import DateUtils from "@/utils/DateUtils";
import { getTimeDiff, isTrainPass } from "@/utils/TrainInfoUtils";
import { useTranslation } from "next-i18next";
import { useMemo } from "react";

export const useThsrTrainDisplay = (data: JsyTimeTable) => {
  const { t } = useTranslation();

  const isPassed = useMemo(
    () =>
      isTrainPass(
        data.TrainDate,
        DateUtils.getCurrentDate(),
        data.OriginStopTime.DepartureTime,
      ),
    [data.TrainDate, data.OriginStopTime],
  );

  const timeRange = useMemo(
    () =>
      `${data.OriginStopTime.DepartureTime} - ${data.DestinationStopTime.ArrivalTime}`,
    [data.OriginStopTime, data.DestinationStopTime],
  );

  const durationText = useMemo(() => {
    const diff = getTimeDiff(
      data.OriginStopTime.DepartureTime,
      data.DestinationStopTime.ArrivalTime,
      data.TrainDate,
    );
    return t("trainInfoTimeDiff", { hour: diff.hour, min: diff.min });
  }, [data.OriginStopTime, data.DestinationStopTime, data.TrainDate, t]);

  return {
    isPassed,
    timeRange,
    durationText,
    trainNo: data.DailyTrainInfo.TrainNo,
  };
};
