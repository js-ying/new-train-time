import { JsyTymcInfo } from "@/models/jsy-tymc-info";
import DateUtils from "@/utils/DateUtils";
import { isTrainPass, isTymcArrivalApprox } from "@/utils/TrainInfoUtils";
import { useTranslation } from "next-i18next";
import { useMemo } from "react";

/**
 * [桃園捷運] 列車時刻顯示資料
 * @param queryDate 查詢日；班次乘車日與其不同即為隔日午夜後上車
 */
export const useTymcTrainDisplay = (
  tymcTimeTable: JsyTymcInfo["timeTables"][0],
  fareList: JsyTymcInfo["fareList"],
  queryDate: string,
) => {
  const { t } = useTranslation();

  const trainDate = tymcTimeTable.trainDate ?? queryDate;
  const isNextDay = trainDate !== queryDate;

  const isPassed = useMemo(
    () =>
      isTrainPass(
        trainDate,
        DateUtils.getCurrentDate(),
        tymcTimeTable?.departureTime,
      ),
    [trainDate, tymcTimeTable],
  );

  const isNormal = useMemo(
    () => String(tymcTimeTable.trainType) === "1",
    [tymcTimeTable.trainType],
  );

  const timeRange = useMemo(
    () => `${tymcTimeTable.departureTime} - ${tymcTimeTable.arrivalTime}`,
    [tymcTimeTable],
  );

  const durationText = useMemo(() => {
    if (!tymcTimeTable.runTime) return "";
    const [hour, min] = tymcTimeTable.runTime
      .split(":")
      .map((s) => parseInt(s, 10));
    return t("trainInfoTimeDiff", { hour, min });
  }, [tymcTimeTable.runTime, t]);

  const isArrivalApprox = useMemo(
    () => isTymcArrivalApprox(tymcTimeTable.arrivalSource),
    [tymcTimeTable.arrivalSource],
  );

  const price = useMemo(() => {
    const fare = fareList.find((f) => f.ticketType === 1 && f.fareClass === 1);
    return fare ? fare.price : 0;
  }, [fareList]);

  return {
    trainDate,
    isNextDay,
    isPassed,
    isNormal,
    timeRange,
    durationText,
    isArrivalApprox,
    price,
  };
};
