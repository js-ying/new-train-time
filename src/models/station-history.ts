/**
 * 通用「單點查詢」歷史模型（台鐵單站 station / 公車路線 route 共用）。
 * 與 OD 站對的 history.ts 分離：OD 存起迄站對，此處存單一 target（站 / 路線）。
 */

/** 單點查詢車種：TR=台鐵單站、BUS=公車路線 */
export type StationTrainType = "TR" | "BUS";

/** 各車種歷史顯示上限 */
export const MAX_STATION_HISTORY = 5;

/**
 * 單點查詢的最小語意：
 * - targetId：唯一識別（TR=station_id、公車=route_uid）
 * - targetName：顯示快照（站名 / 路線名）
 * - meta：重查所需附加路由資訊；公車存 "source|city"，TR 為 undefined
 */
export interface StationTarget {
  targetId: string;
  targetName: string;
  meta?: string;
}

/** 實際儲存 / 同步的單筆：在 StationTarget 上加最後查詢時間（毫秒，作 LWW 依據） */
export interface StoredStationHistory extends StationTarget {
  lastUsedAt: number;
}

/** 依車種分組的歷史 map（各車種已 newest-first 且 ≤ MAX_STATION_HISTORY 筆） */
export type StationHistoryMap = Record<StationTrainType, StoredStationHistory[]>;
