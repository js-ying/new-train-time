import fetchData from "./fetchData";

/** 對應後端 ALLOWED_TRAIN_TYPES */
export type ReportTrainType = "TR" | "THSR" | "TYMC";

/**
 * 轉乘回報原因類型：用於後端 user_transfer_reports 表分類聚合，
 * 驅動後續演算法 / 前端 ranking 的修補方向。
 * - missing：使用者覺得方案太少（對應 csa-v2 漏列分析）
 * - extra：使用者覺得方案太多或重複（對應多列 / hub variants）
 * - hub：換車站點不合理（對應 hub 選擇 / R-NH 之類規則）
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
