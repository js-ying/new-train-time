/** 歷史查詢的車種；對齊後端 DB enum 與 PageEnum（TR/THSR/TYMC） */
export type TrainType = "TR" | "THSR" | "TYMC";

/** 歷史查詢分頁顯示上限（純時間序） */
export const MAX_HISTORY = 5;

/** 歷史查詢的最小語意（點擊回填、輸入比對只需起迄站） */
export interface HistoryInquiry {
  startStationId: string;
  endStationId: string;
}

/**
 * 實際儲存 / 同步的歷史單筆：在 HistoryInquiry 上加最後查詢時間。
 * lastUsedAt 為毫秒時間戳，作為跨裝置 per-row union 的 LWW 依據。
 */
export interface StoredHistoryInquiry extends HistoryInquiry {
  lastUsedAt: number;
}

/** 依車種分組的歷史 map（各車種已排序 newest-first 且 ≤ MAX_HISTORY 筆） */
export type HistoryMap = Record<TrainType, StoredHistoryInquiry[]>;
