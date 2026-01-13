import { JsyOperationAlert } from "@/models/jsy-operation-alert";
import { JsyTymcInfo } from "@/models/jsy-tymc-info";
import fetchData from "./fetchData";

/** 取得桃捷詳細資訊 */
export const getTymcInfo = async (
  startStationId: string,
  endStationId: string,
  date: string,
  time: string,
): Promise<JsyTymcInfo> => {
  return await fetchData("/api/getJsyTymcInfo", {
    startStationId,
    endStationId,
    date,
    time,
  });
};

/** 取得桃捷營運告警 */
export const getTymcAlert = async (): Promise<JsyOperationAlert> => {
  return await fetchData("/api/getJsyTymcAlert");
};
