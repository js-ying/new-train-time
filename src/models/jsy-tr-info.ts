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
}
