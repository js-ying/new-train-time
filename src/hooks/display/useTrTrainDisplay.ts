import { TrDailyTrainTimetable } from "@/models/jsy-tr-info";

import DateUtils from "@/utils/DateUtils";
import {
  getTimeDiff,
  isTrTrainOnlyTicket,
  isTrainPass,
} from "@/utils/TrainInfoUtils";
import { useTranslation } from "next-i18next";
import { useMemo } from "react";

export const useTrTrainDisplay = (data: TrDailyTrainTimetable) => {
  const { t } = useTranslation();

  const isPassed = useMemo(
    () =>
      isTrainPass(
        data.jsyTrainDate,
        DateUtils.getCurrentDate(),
        data.StopTimes[0].DepartureTime,
      ),
    [data.jsyTrainDate, data.StopTimes],
  );

  const isOnlyTicket = useMemo(
    () => isTrTrainOnlyTicket(data.TrainInfo.TrainTypeCode),
    [data.TrainInfo.TrainTypeCode],
  );

  const timeRange = useMemo(
    () =>
      `${data.StopTimes[0].DepartureTime} - ${data.StopTimes[data.StopTimes.length - 1].ArrivalTime}`,
    [data.StopTimes],
  );

  const durationText = useMemo(() => {
    const diff = getTimeDiff(
      data.StopTimes[0].DepartureTime,
      data.StopTimes[data.StopTimes.length - 1].ArrivalTime,
      data.jsyTrainDate,
    );

    return t("trainInfoTimeDiff", { hour: diff.hour, min: diff.min });
  }, [data.StopTimes, data.jsyTrainDate, t]);

  return {
    isPassed,
    isOnlyTicket,
    timeRange,
    durationText,
    note: data.TrainInfo.Note,
    typeName: data.TrainInfo.TrainTypeName.Zh_tw,
    trainNo: data.TrainInfo.TrainNo,
  };
};
