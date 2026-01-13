import { TrDailyTrainTimetable } from "@/models/tr-train-time-table";
import fetchData from "./fetchData";

/** 取得台鐵時刻表 */
export const getTrTrainTimeTable = async (
  startStationId: string,
  endStationId: string,
  date: string,
  time: string,
): Promise<TrDailyTrainTimetable> => {
  return await fetchData("/api/getTrainTimeTable", {
    startStationId,
    endStationId,
    date,
    time,
  });
};
