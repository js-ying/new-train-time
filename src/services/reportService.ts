import fetchData from "./fetchData";

/** 對應後端 ALLOWED_TRAIN_TYPES */
export type ReportTrainType = "TR" | "THSR" | "TYMC";

export interface PostTransferReportParams {
  trainType: ReportTrainType;
  startStationId: string;
  endStationId: string;
  date: string;
}

/** 回報「我確定此查詢條件有轉乘方案」；失敗會以 ApiError 拋出 */
export const postTransferReport = async (
  params: PostTransferReportParams,
): Promise<{ applied: boolean }> => {
  return await fetchData("/api/postTransferReport", params, "POST");
};
