import { JsyThsrTimetable } from "@/models/jsy-thsr-info";

import DateUtils from "@/utils/DateUtils";
import { getTimeDiff, isTrainPass } from "@/utils/TrainInfoUtils";
import { useTranslation } from "next-i18next";
import { useMemo } from "react";

/**
 * [高鐵] 列車時刻顯示資料
 * @param queryDate 查詢日；班次乘車日與其不同即為隔日午夜後上車
 */
export const useThsrTrainDisplay = (
  data: JsyThsrTimetable,
  queryDate?: string,
) => {
  const { t } = useTranslation();

  const isNextDay = !!queryDate && data.trainDate !== queryDate;

  const isPassed = useMemo(
    () =>
      isTrainPass(
        data.trainDate,
        DateUtils.getCurrentDate(),
        data.originStopTime.departureTime,
      ),
    [data.trainDate, data.originStopTime],
  );

  const timeRange = useMemo(
    () =>
      `${data.originStopTime.departureTime} - ${data.destinationStopTime.arrivalTime}`,
    [data.originStopTime, data.destinationStopTime],
  );

  const durationText = useMemo(() => {
    const diff = getTimeDiff(
      data.originStopTime.departureTime,
      data.destinationStopTime.arrivalTime,
      data.trainDate,
    );
    return t("trainInfoTimeDiff", { hour: diff.hour, min: diff.min });
  }, [data.originStopTime, data.destinationStopTime, data.trainDate, t]);

  return {
    isPassed,
    timeRange,
    durationText,
    isNextDay,
    trainNo: data.trainInfo.trainNo,
  };
};
