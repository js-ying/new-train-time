/**
 * 台鐵 Jsy 契約 (camelCase；後端 mapper 之輸出)
 */
import { JsyAnnouncement } from "./jsy-announcement";

export interface JsyName {
  zhTw: string;
  en: string;
}

export interface JsyTrInfo {
  timeTables: JsyTrTimetable[];
  trainDate: string;
  announcements: JsyAnnouncement[];
}

export interface JsyTrTimetable {
  trainInfo: JsyTrTrainInfo;
  stopTimes: JsyTrStopTime[];
  fareList: JsyTrFare[];
  delayInfo: JsyTrDelay[];
  trainDate: string;
}

export interface JsyTrTrainInfo {
  trainNo: string;
  trainTypeCode: string;
  trainTypeName: JsyName;
  /** TDX Direction：0 順行 / 1 逆行（西部幹線上 0=北上、1=南下） */
  direction: number;
  startingStationId: string;
  startingStationName: JsyName;
  endingStationId: string;
  endingStationName: JsyName;
  /** 0:不經山海線 1:山線 2:海線 */
  tripLine: number;
  wheelChairFlag: number;
  packageServiceFlag: number;
  diningFlag: number;
  breastFeedFlag: number;
  bikeFlag: number;
  extraTrainFlag: number;
  note: string;
}

export interface JsyTrStopTime {
  stopSequence: number;
  stationId: string;
  stationName: JsyName;
  arrivalTime: string;
  departureTime: string;
}

/** 單站時刻表中的一班車（精簡：只帶該站停靠時間，無全停靠表與票價） */
export interface JsyTrStationTrain {
  trainInfo: JsyTrTrainInfo;
  /** 該班車在查詢站的停靠資訊（到站 / 離站時間） */
  stopTime: JsyTrStopTime;
  /** 誤點資訊（僅今日且該站發車 90 分鐘內的列車有值，其餘為空陣列） */
  delayInfo: JsyTrDelay[];
}

/** 單站某方向的標示（北上/南下 與代表終點大站） */
export interface JsyTrStationDirection {
  /** TDX Direction：0 順行 / 1 逆行 */
  direction: number;
  /** 此站是否在西部幹線（可標北上/南下）；支線/南迴/東部為 false，只標往⟨終點⟩ */
  showNorthSouth: boolean;
  /** showNorthSouth 為 true 時：'north' 北上 / 'south' 南下；否則 null */
  northSouth: "north" | "south" | null;
  /** 代表終點大站（取該站該方向實際列車終點最常見的 1-2 站） */
  terminals: JsyName[];
}

/** 單站全日方向別時刻表（北上/南下時刻表頁用） */
export interface JsyTrStationTimetable {
  stationId: string;
  trainDate: string;
  /** 兩個方向（0/1）的標示摘要；某方向無車時 terminals 為空 */
  directions: JsyTrStationDirection[];
  /** 停靠該站的所有列車，依該站停靠時間排序（方向由 trainInfo.direction 區分） */
  timeTables: JsyTrStationTrain[];
  announcements: JsyAnnouncement[];
}

export interface JsyTrFare {
  price: number;
}

export interface JsyTrDelay {
  /** 誤點分鐘數 */
  delayTime: number;
}

/** 跨支線轉乘的單一段次（一班車的上下車資訊） */
export interface JsyTrTransferLeg {
  trainInfo: JsyTrTrainInfo;
  /** 上車站停靠資訊 */
  boardStopTime: JsyTrStopTime;
  /** 下車站停靠資訊 */
  alightStopTime: JsyTrStopTime;
  /** 該段車次完整停靠時刻（含起訖站） */
  stopTimes: JsyTrStopTime[];
  /** 該段票價；無票價資料時為 null（UI 不顯示票價，欄位保留以備未來使用） */
  fare: JsyTrFare | null;
}

/** 跨支線轉乘的單一組合（含兩段或三段） */
export interface JsyTrTransferCombination {
  legs: JsyTrTransferLeg[];
  /** 每個轉乘點的等待分鐘數，長度 = legs.length - 1 */
  waitMinutes: number[];
  /** 全程總耗時（分鐘，含等待） */
  totalMinutes: number;
  /** 該方案經過的轉乘站（length = legs.length - 1） */
  hubStations: JsyName[];
}

export interface JsyTrTransferInfo {
  trainDate: string;
  combinations: JsyTrTransferCombination[];
  announcements: JsyAnnouncement[];
  /** 該 OD 在查詢時間後是否有直達車；轉乘 0 筆時用以引導切『直達』查詢 */
  hasDirect: boolean;
}
