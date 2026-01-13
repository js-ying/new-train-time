import { JsyThsrInfo } from "@/models/jsy-thsr-info";
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
