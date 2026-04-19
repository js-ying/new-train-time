import { JsyTymcInfo } from "@/models/jsy-tymc-info";
import DateUtils from "@/utils/DateUtils";
import { isTrainPass } from "@/utils/TrainInfoUtils";
import { useTranslation } from "next-i18next";
import { useMemo } from "react";

export const useTymcTrainDisplay = (
  tymcTimeTable: JsyTymcInfo["timeTables"][0],
  fareList: JsyTymcInfo["fareList"],
  trainDate: string,
) => {
  const { t } = useTranslation();

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

  const price = useMemo(() => {
    const fare = fareList.find((f) => f.ticketType === 1 && f.fareClass === 1);
    return fare ? fare.price : 0;
  }, [fareList]);

  return {
    isPassed,
    isNormal,
    timeRange,
    durationText,
    price,
  };
};
