/**
 * 公車 Jsy 契約型別 (camelCase；後端 mapper 之輸出，1:1 對應後端 jsy/bus-info.ts)。
 * 三來源統一介面，以 source 區分。前端只允許 Jsy 介面，禁止任何 Tdx 型別。
 */

/** 資料來源：市區公車 / 公路客運(含國道) / 觀光台灣好行。 */
export type BusSource = "city" | "intercity" | "taiwantrip";

/** 路線索引項（模糊搜的候選）。routeUid 跨來源唯一，當主鍵。 */
export interface JsyBusRoute {
  routeUid: string;
  routeName: string;
  routeNameEn?: string;
  source: BusSource;
  /** 市區公車的縣市（英文代碼如 Taipei）；公路客運/台灣好行多為空。 */
  city?: string;
  /** 起站名（顯示「起 - 訖」用）。 */
  departureStop: string;
  destinationStop: string;
  /** 11:市區公車 12:公路客運 13:國道客運 14:接駁車。 */
  routeType: number;
  /**
   * 是否為台灣好行（顯示分類/名稱用）。城市籍好行 source 仍為 city（即時 N1 在 City 端點），
   * 但以此旗標顯示「台灣好行」分類；來源標籤優先看此旗標。
   */
  isTaiwanTrip?: boolean;
}

/** 站序骨幹中的單站。 */
export interface JsyBusStop {
  stopUid: string;
  stopName: string;
  stopSequence: number;
}

/** 某方向的站序骨幹。 */
export interface JsyBusRouteStops {
  routeUid: string;
  routeName: string;
  /** 0:去程 1:返程。 */
  direction: number;
  /** 該方向終點顯示名。 */
  destinationStop: string;
  stops: JsyBusStop[];
}

/**
 * 各站到站狀態（後端 mapper 依 StopStatus + EstimateTime 推導；前端只對應 i18n 文字渲染）。
 * - arriving       進站中（≤30s 或正在進站）
 * - approaching    即將到站（≤120s）
 * - minutes        X 分（estimateMinutes 有值）
 * - notDeparted    尚未發車
 * - trafficControl 交管不停靠
 * - lastBusPassed  末班車已過
 * - notInService   今日未營運
 * - noData         無班次資料 / --
 */
export type BusArrivalState =
  | "arriving"
  | "approaching"
  | "minutes"
  | "notDeparted"
  | "trafficControl"
  | "lastBusPassed"
  | "notInService"
  | "noData";

/** 站序骨幹貼回即時到站後的單站。 */
export interface JsyBusStopArrival extends JsyBusStop {
  state: BusArrivalState;
  /** state=minutes 時的分鐘數；其餘狀態為 null。 */
  estimateMinutes: number | null;
  /** 有車進站時的車牌（供前端標示）。 */
  plateNumb?: string;
  isLastBus?: boolean;
}

/** 一個方向的即時看板。 */
export interface JsyBusRouteBoard {
  routeUid: string;
  routeName: string;
  direction: number;
  destinationStop: string;
  stops: JsyBusStopArrival[];
}

/** 班距式服務時段（無固定時刻；前端以 i18n 格式化文字）。 */
export interface JsyBusHeadway {
  startTime: string;
  endTime: string;
  minHeadwayMins?: number;
  maxHeadwayMins?: number;
}

/** 某子線/方向的定期時刻（平日/假日各班發車時間；班距式則給 headway 結構）。 */
export interface JsyBusScheduleGroup {
  /** 0:去程 1:返程 2:迴圈。 */
  direction: number;
  subRouteName: string;
  weekdayTimes: string[];
  holidayTimes: string[];
  weekdayHeadways?: JsyBusHeadway[];
  holidayHeadways?: JsyBusHeadway[];
}

/** 路線詳細資訊（info modal；業者僅名稱、routeMapImageUrl 為官方路線圖頁）。 */
export interface JsyBusRouteInfo {
  routeUid: string;
  routeName: string;
  departureStop: string;
  destinationStop: string;
  operators: string[];
  ticketPrice?: string;
  fareBufferZone?: string;
  routeMapImageUrl?: string;
  schedules: JsyBusScheduleGroup[];
}
