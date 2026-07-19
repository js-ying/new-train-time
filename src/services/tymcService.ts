import { JsyOperationAlert } from "@/models/jsy-operation-alert";
import { JsyTymcInfo } from "@/models/jsy-tymc-info";
import fetchData from "./fetchData";
import { optionalAuthHeader } from "./optionalAuth";

/** 取得桃捷詳細資訊 */
export const getTymcInfo = async (
  startStationId: string,
  endStationId: string,
  date: string,
  time: string,
  signal?: AbortSignal,
): Promise<JsyTymcInfo> => {
  return await fetchData(
    "/api/getJsyTymcInfo",
    { startStationId, endStationId, date, time },
    "POST",
    signal,
    await optionalAuthHeader(),
  );
};

/** 取得桃捷營運告警 */
export const getTymcAlert = async (): Promise<JsyOperationAlert> => {
  return await fetchData("/api/getJsyTymcAlert");
};
