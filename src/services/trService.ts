import {
  JsyDeeplinkResponse,
  JsyTrDeeplinkDirectParams,
  JsyTrDeeplinkWebParams,
} from "@/models/jsy-deeplink";
import { JsyOperationAlert } from "@/models/jsy-operation-alert";
import { JsyTrInfo } from "@/models/jsy-tr-info";

import fetchData from "./fetchData";

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
