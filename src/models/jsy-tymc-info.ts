/**
 * 桃園捷運 Jsy 契約 (camelCase；後端 mapper 之輸出)
 */
import { JsyAnnouncement } from "./jsy-announcement";

export interface JsyTymcInfo {
  startStationId: string;
  endStationId: string;
  date: string;
  time: string;
  timeTables: JsyTymcTimetable[];
  fareList: JsyTymcFare[];
  announcements: JsyAnnouncement[];
}

export interface JsyTymcTimetable {
  sequence: number;
  /** 起站發車時刻 hh:mm */
  departureTime: string;
  /** 抵達迄站時刻 hh:mm (推算) */
  arrivalTime: string;
  /** 行駛時間 hh:mm */
  runTime: string;
  /** 0:不分車種 1:普通車 2:直達車 */
  trainType?: number;
  /** 該班次停靠的車站 ID 清單 (依方向排序) */
  stoppingStationIdList: string[];
  fareList: JsyTymcFare[];
}

export interface JsyTymcFare {
  /** 1:一般票 2:來回票 3:電子票證 4:回數票 5:定期票30天 6:定期票60天 */
  ticketType: number;
  /** 1:成人 2:學生 3:孩童 4:敬老 5:愛心 6:愛心孩童 7:愛心優待/愛心陪伴 8:團體 */
  fareClass: number;
  price: number;
}
