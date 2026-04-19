import { JsyTrTimetable } from "@/models/jsy-tr-info";

import DateUtils from "@/utils/DateUtils";
import {
  getTimeDiff,
  isTrTrainOnlyTicket,
  isTrainPass,
} from "@/utils/TrainInfoUtils";
import { useTranslation } from "next-i18next";
import { useMemo } from "react";

export const useTrTrainDisplay = (data: JsyTrTimetable) => {
  const { t } = useTranslation();

  const isPassed = useMemo(
    () =>
      isTrainPass(
        data.trainDate,
        DateUtils.getCurrentDate(),
        data.stopTimes[0].departureTime,
      ),
    [data.trainDate, data.stopTimes],
  );

  const isOnlyTicket = useMemo(
    () => isTrTrainOnlyTicket(data.trainInfo.trainTypeCode),
    [data.trainInfo.trainTypeCode],
  );

  const timeRange = useMemo(
    () =>
      `${data.stopTimes[0].departureTime} - ${data.stopTimes[data.stopTimes.length - 1].arrivalTime}`,
    [data.stopTimes],
  );

  const durationText = useMemo(() => {
    const diff = getTimeDiff(
      data.stopTimes[0].departureTime,
      data.stopTimes[data.stopTimes.length - 1].arrivalTime,
      data.trainDate,
    );

    return t("trainInfoTimeDiff", { hour: diff.hour, min: diff.min });
  }, [data.stopTimes, data.trainDate, t]);

  return {
    isPassed,
    isOnlyTicket,
    timeRange,
    durationText,
    note: data.trainInfo.note,
    typeName: data.trainInfo.trainTypeName.zhTw,
    trainNo: data.trainInfo.trainNo,
  };
};
