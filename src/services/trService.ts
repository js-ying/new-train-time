import { JsyOperationAlert } from "@/models/jsy-operation-alert";
import {
  JsyTrInfo,
  TraDeeplinkDirectParams,
  TraDeeplinkDirectResponse,
  TraDeeplinkWebParams,
  TraDeeplinkWebResponse,
} from "@/models/jsy-tr-info";

import fetchData from "./fetchData";

/** 取得台鐵時刻表 */
export const getJsyTrInfo = async (
  startStationId: string,
  endStationId: string,
  date: string,
  time: string,
): Promise<JsyTrInfo> => {
  return await fetchData("/api/getJsyTrInfo", {
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
