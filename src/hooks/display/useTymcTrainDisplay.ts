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
        tymcTimeTable?.DepartureTime,
      ),
    [trainDate, tymcTimeTable],
  );

  const isNormal = useMemo(
    () => String(tymcTimeTable.TrainType) === "1",
    [tymcTimeTable.TrainType],
  );

  const timeRange = useMemo(
    () => `${tymcTimeTable.DepartureTime} - ${tymcTimeTable.jsyArrivalTime}`,
    [tymcTimeTable],
  );

  const durationText = useMemo(() => {
    if (!tymcTimeTable.jsyRunTime) return "";
    const [hour, min] = tymcTimeTable.jsyRunTime
      .split(":")
      .map((s) => parseInt(s, 10));
    return t("trainInfoTimeDiff", { hour, min });
  }, [tymcTimeTable.jsyRunTime, t]);

  const price = useMemo(() => {
    const fare = fareList.find((f) => f.TicketType === 1 && f.FareClass === 1);
    return fare ? fare.Price : 0;
  }, [fareList]);

  return {
    isPassed,
    isNormal,
    timeRange,
    durationText,
    price,
  };
};
