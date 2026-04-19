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
  startingStationName: JsyName;
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
