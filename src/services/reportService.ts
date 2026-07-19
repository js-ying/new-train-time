import fetchData from "./fetchData";

/** 對應後端 ALLOWED_TRAIN_TYPES */
export type ReportTrainType = "TR" | "THSR" | "TYMC";

/**
 * 轉乘回報原因類型（供後端分類聚合）：
 * - missing：使用者覺得方案太少
 * - extra：使用者覺得方案太多或重複
 * - hub：換車站點不合理
 * - other：其他問題
 */
export type ReportTransferReason = "missing" | "extra" | "hub" | "other";

export interface PostTransferReportParams {
  trainType: ReportTrainType;
  startStationId: string;
  endStationId: string;
  date: string;
  /** 使用者選擇的問題類型；缺值時後端應視為 "other" */
  reason?: ReportTransferReason;
}

/** 回報「我確定此查詢條件有轉乘方案」；失敗會以 ApiError 拋出 */
export const postTransferReport = async (
  params: PostTransferReportParams,
): Promise<{ applied: boolean }> => {
  return await fetchData("/api/postTransferReport", params, "POST");
};
