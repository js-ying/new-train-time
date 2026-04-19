/**
 * 高鐵 Jsy 契約 (camelCase；後端 mapper 之輸出)
 */
import { JsyAnnouncement } from "./jsy-announcement";
import { JsyName } from "./jsy-tr-info";

export interface JsyThsrInfo {
  timeTables: JsyThsrTimetable[];
  fareList: JsyThsrOdFare[];
  freeSeatingCars: JsyThsrFreeSeatingCar[];
  generalTimeTable: JsyThsrGeneralTimetable[];
  announcements: JsyAnnouncement[];
  /** 是否為定期時刻表 (查詢日超過 27 天) */
  isGeneralTimetable?: boolean;
}

export interface JsyThsrTimetable {
  trainDate: string;
  trainInfo: JsyThsrTrainInfo;
  originStopTime: JsyThsrStopTime;
  destinationStopTime: JsyThsrStopTime;
  /** 標準車廂剩餘座位 (X 售完 / L 即將售完 / O 充足) */
  standardSeatStatus: "X" | "L" | "O" | null;
  businessSeatStatus: "X" | "L" | "O" | null;
}

export interface JsyThsrTrainInfo {
  trainNo: string;
  startingStationName: JsyName;
  endingStationName: JsyName;
}

export interface JsyThsrStopTime {
  stationId: string;
  stationName: JsyName;
  arrivalTime: string;
  departureTime: string;
}

export interface JsyThsrOdFare {
  fares: JsyThsrFare[];
}

export interface JsyThsrFare {
  ticketType: number;
  fareClass: number;
  cabinClass: number;
  price: number;
}

export interface JsyThsrFreeSeatingCar {
  trainNo: string;
  /** 自由座車廂號碼字串 (例 "10,11") */
  carConfig: string;
}

export interface JsyThsrGeneralTimetable {
  trainInfo: JsyThsrTrainInfo;
  stopTimes: JsyThsrGeneralStopTime[];
  serviceDay: {
    monday: number;
    tuesday: number;
    wednesday: number;
    thursday: number;
    friday: number;
    saturday: number;
    sunday: number;
  };
}

export interface JsyThsrGeneralStopTime {
  stopSequence: number;
  stationId: string;
  stationName: JsyName;
  arrivalTime?: string;
  departureTime?: string;
}
