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
  /** 子線名（如 1822A）；route 粒度候選無此值。查看板時以此篩骨幹，並與 routeUid 合成歷史/收藏鍵。 */
  subRouteName?: string;
  source: BusSource;
  /** 市區公車的縣市（英文代碼如 Taipei）；公路客運/台灣好行多為空。 */
  city?: string;
  /** 起站名（顯示「起 - 訖」用）。 */
  departureStop: string;
  destinationStop: string;
  /** 子線去程方向牌（如「臺北→苗栗[經林口長庚醫院]」）；有則搜尋候選副標優先用，無則退「起 - 訖」。 */
  headsign?: string;
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
  /** 該站所屬縣市碼（後端 StopUID 反查 bus_stop）；有值才可點該站跳站牌看板，無值（公路客運站）不可點。 */
  city?: string;
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
  /** 起站未發車時，定期時刻表推得的下一班發車時刻（HH:mm）。 */
  nextDepartTime?: string;
}

/** 單筆營運通阻公告（形狀對齊 JsyOperationAlert 的 alerts 元素，呈現層共用樣式）。 */
export interface JsyBusAlert {
  /** danger=全部營運停止、warning=異常/改道。 */
  status: "warning" | "danger";
  publishTime: string;
  startTime: string;
  endTime: string;
  title: string;
  desc: string;
}

/** 一個方向的即時看板。 */
export interface JsyBusRouteBoard {
  routeUid: string;
  routeName: string;
  direction: number;
  /** 方向 tab 顯示名（TDX 路線定義方向目的地，與站牌看板/詳細資訊一致；非站序末站）。 */
  destinationStop: string;
  stops: JsyBusStopArrival[];
  /** 路線來源/縣市（後端 routeUid 反查索引的權威值；存歷史/收藏 meta 用，URL 不帶 source/city）。 */
  source?: BusSource;
  city?: string;
  /** 命中本路線且生效中的營運通阻公告；無則不帶。兩方向帶同組。 */
  alerts?: JsyBusAlert[];
  /** N1 即時資料實際取得時間（epoch ms）；搭配 isStale 標示資料時效。 */
  updatedAt: number;
  /** true = 上游異常、本回應為過期舊資料；正常時不帶。 */
  isStale?: boolean;
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
  /** 平日/假日首末班車（HH:mm，跨子線彙整）；多為市區公車才有，無則略過。 */
  firstLastBus?: JsyBusFirstLastBus;
  schedules: JsyBusScheduleGroup[];
}

/** 首末班車（平日/假日各一組 first/last，HH:mm）。 */
export interface JsyBusFirstLastBus {
  weekday?: { first: string; last: string };
  holiday?: { first: string; last: string };
}

/** 離我最近站牌（定位解析結果；stopUid 為站牌看板查詢錨點，stopName 供顯示）。 */
export interface JsyBusNearestStop {
  /** 站牌唯一碼；前端據此 push 站牌看板（source/city 後端反查）。 */
  stopUid: string;
  city: string;
  /** 站牌來源（全站表含三來源，nearest 可能落在公路客運/台灣好行站）；顯示用。 */
  source?: BusSource;
  stopName: string;
  lat: number;
  lon: number;
  /** 與使用者的距離（公尺）。 */
  distanceM: number;
}

/** 站牌看板單列：某路線該方向的即時到站。 */
export interface JsyBusStopBoardRoute {
  /** 路線 UID（供點擊跳路線看板；source 固定 city、city 取看板所在縣市）。 */
  routeUid: string;
  routeName: string;
  /** 子線名（如 1822A）；為索引展開候選時才有，點擊帶 sub 精確導向該子線。route 粒度為 undefined。 */
  subRouteName?: string;
  /** 往的終點站名。 */
  destination: string;
  direction: number;
  state: BusArrivalState;
  estimateMinutes: number | null;
}

/** 同名站牌的各柱變體（同名多座標 tab；使用者切到正確那根柱）。 */
export interface JsyBusStopVariant {
  /** 該柱代表 StopUID；點 tab 以此 push 站牌看板。 */
  stopUid: string;
  stopName: string;
  /** tab 主文字（站柱顯示標籤）。 */
  label: string;
  /** 方位（tab 標籤，如「N」；前端轉 i18n 方向詞）。 */
  bearing?: string;
  lat: number;
  lon: number;
}

/** 收藏站點看板單列：某（站牌×路線×方向）的即時到站；echo 查詢 key + 權威顯示值。 */
export interface JsyBusStopBoardsBatchItem {
  stopUid: string;
  routeUid: string;
  direction: number;
  subRouteName?: string;
  /** 權威站名 / 路線名 / 終點（該站看板此刻查無該路線列時為空字串，前端退回收藏快照）。 */
  stopName: string;
  routeName: string;
  destination: string;
  state: BusArrivalState;
  estimateMinutes: number | null;
}

/** 收藏站點看板：多筆（站牌×路線×方向）一次查（items 順序同請求）。 */
export interface JsyBusStopBoardsBatch {
  items: JsyBusStopBoardsBatchItem[];
  updatedAt: number;
  /** true = 任一站牌看板為 staleOnError 舊資料。 */
  isStale?: boolean;
}

/** 站牌即時看板：該站牌所有路線的到站（依最近排序）。 */
export interface JsyBusStopBoard {
  /** 站所屬縣市碼（市區公車＝City；公路客運/台灣好行＝LocationCityCode）。 */
  city: string;
  stopName: string;
  /** 站牌來源；點某列跳路線看板時據此帶對 source。 */
  source: BusSource;
  routes: JsyBusStopBoardRoute[];
  /** 同名多座標時的各柱變體（含當前柱）；≤1 個時前端不顯示 tab。 */
  variants?: JsyBusStopVariant[];
  /** N1 即時資料實際取得時間（epoch ms）；搭配 isStale 標示資料時效。 */
  updatedAt: number;
  /** true = 上游異常、本回應為過期舊資料；正常時不帶。 */
  isStale?: boolean;
}
