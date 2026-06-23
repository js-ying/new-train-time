import {
  JsyDeeplinkResponse,
  JsyTrDeeplinkDirectParams,
  JsyTrDeeplinkWebParams,
} from "@/models/jsy-deeplink";
import { JsyOperationAlert } from "@/models/jsy-operation-alert";
import {
  JsyTrInfo,
  JsyTrStationTimetable,
  JsyTrTimetable,
  JsyTrTransferInfo,
} from "@/models/jsy-tr-info";

import fetchData from "./fetchData";

/** 取得台鐵單站全日方向別時刻表（北上/南下時刻表頁） */
export const getJsyTrStationTimetable = async (
  stationId: string,
  date?: string,
  signal?: AbortSignal,
): Promise<JsyTrStationTimetable> => {
  return await fetchData(
    "/api/getJsyTrStationTimetable",
    { stationId, ...(date ? { date } : {}) },
    "POST",
    signal,
  );
};

/** 取得單一車次完整停靠時刻（單站時刻表「列車詳細資訊」用） */
export const getJsyTrTrainStopTimes = async (
  trainNo: string,
  date?: string,
  signal?: AbortSignal,
): Promise<JsyTrTimetable> => {
  return await fetchData(
    "/api/getJsyTrTrainStopTimes",
    { trainNo, ...(date ? { date } : {}) },
    "POST",
    signal,
  );
};

/** 取得台鐵時刻表 */
export const getJsyTrInfo = async (
  startStationId: string,
  endStationId: string,
  date: string,
  time: string,
  signal?: AbortSignal,
): Promise<JsyTrInfo> => {
  return await fetchData(
    "/api/getJsyTrInfo",
    { startStationId, endStationId, date, time },
    "POST",
    signal,
  );
};

/** 取得台鐵跨支線轉乘規劃 */
export const getJsyTrTransferInfo = async (
  startStationId: string,
  endStationId: string,
  date: string,
  time: string,
  signal?: AbortSignal,
): Promise<JsyTrTransferInfo> => {
  return await fetchData(
    "/api/getJsyTrTransferInfo",
    { startStationId, endStationId, date, time },
    "POST",
    signal,
  );
};

/** 取得台鐵營運告警 */
export const getTrAlert = async (): Promise<JsyOperationAlert> => {
  return await fetchData("/api/getJsyTrAlert");
};

/** 取得台鐵 App 訂票連結 */
export const getTrDeeplinkDirect = async (
  params: JsyTrDeeplinkDirectParams,
): Promise<{ data: JsyDeeplinkResponse }> => {
  return await fetchData("/api/getTraDeeplinkDirect", params);
};

/** 取得台鐵網頁訂票連結 */
export const getTrDeeplinkWeb = async (
  params: JsyTrDeeplinkWebParams,
): Promise<{ data: JsyDeeplinkResponse }> => {
  return await fetchData("/api/getTraDeeplinkWeb", params);
};
