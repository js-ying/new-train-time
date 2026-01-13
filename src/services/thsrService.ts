import { JsyOperationAlert } from "@/models/jsy-operation-alert";
import {
  JsyThsrInfo,
  ThsrDeeplinkDirectParams,
  ThsrDeeplinkDirectResponse,
  ThsrDeeplinkWebParams,
  ThsrDeeplinkWebResponse,
} from "@/models/jsy-thsr-info";
import fetchData from "./fetchData";

/** 取得高鐵詳細資訊 (含時刻表、票價、自由座) */
export const getThsrInfo = async (
  startStationId: string,
  endStationId: string,
  date: string,
  time: string,
): Promise<JsyThsrInfo> => {
  return await fetchData("/api/getJsyThsrInfo", {
    startStationId,
    endStationId,
    date,
    time,
  });
};

/** 取得高鐵營運告警 */
export const getThsrAlert = async (): Promise<JsyOperationAlert> => {
  return await fetchData("/api/getJsyThsrAlert");
};

/** 取得高鐵 App 訂票連結 */
export const getThsrDeeplinkDirect = async (
  params: ThsrDeeplinkDirectParams,
): Promise<{ data: ThsrDeeplinkDirectResponse }> => {
  return await fetchData("/api/getThsrDeeplinkDirect", params);
};

/** 取得高鐵網頁訂票連結 */
export const getThsrDeeplinkWeb = async (
  params: ThsrDeeplinkWebParams,
): Promise<{ data: ThsrDeeplinkWebResponse }> => {
  return await fetchData("/api/getThsrDeeplinkWeb", params);
};
