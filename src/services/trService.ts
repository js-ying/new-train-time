import { JsyOperationAlert } from "@/models/jsy-operation-alert";
import {
  TrDailyTrainTimetable,
  TraDeeplinkDirectParams,
  TraDeeplinkDirectResponse,
  TraDeeplinkWebParams,
  TraDeeplinkWebResponse,
} from "@/models/tr-train-time-table";
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

/** 取得台鐵營運告警 */
export const getTrAlert = async (): Promise<JsyOperationAlert> => {
  return await fetchData("/api/getJsyTrAlert");
};

/** 取得台鐵 App 訂票連結 */
export const getTrDeeplinkDirect = async (
  params: TraDeeplinkDirectParams,
): Promise<{ data: TraDeeplinkDirectResponse }> => {
  return await fetchData("/api/getTraDeeplinkDirect", params);
};

/** 取得台鐵網頁訂票連結 */
export const getTrDeeplinkWeb = async (
  params: TraDeeplinkWebParams,
): Promise<{ data: TraDeeplinkWebResponse }> => {
  return await fetchData("/api/getTraDeeplinkWeb", params);
};
