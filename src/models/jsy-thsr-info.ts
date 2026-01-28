import { JsyAnnouncement } from "./jsy-announcement";

export interface JsyThsrInfo {
  timeTables: ThsrDailyTimetable[];
  fareList: ThsrOdFare[];
  freeSeatingCars: ThsrFreeSeatingCar[];
  generalTimeTable: ThsrTdxGeneralTimeTable[];
  announcements: JsyAnnouncement[];
}

// 含 jsy 客製欄位
export interface ThsrDailyTimetable {
  TrainDate: string;
  DailyTrainInfo: {
    TrainNo: string;
    Direction: number;
    StartingStationID: string;
    StartingStationName: {
      Zh_tw: string;
      En: string;
    };
    EndingStationID: string;
    EndingStationName: {
      Zh_tw: string;
      En: string;
    };
    Note: {}; // Note 的類型可能需要進一步確定
  };
  OriginStopTime: {
    StopSequence: number;
    StationID: string;
    StationName: {
      Zh_tw: string;
      En: string;
    };
    ArrivalTime: string;
    DepartureTime: string;
  };
  DestinationStopTime: {
    StopSequence: number;
    StationID: string;
    StationName: {
      Zh_tw: string;
      En: string;
    };
    ArrivalTime: string;
    DepartureTime: string;
  };
  UpdateTime: string;
  VersionID: number;
  jsyStandardSeatStatus?: "X" | "L" | "O" | null; // [客製] 標準車廂剩餘座位
  jsyBusinessSeatStatus?: "X" | "L" | "O" | null; // [客製] 商務車廂剩餘座位
}

export interface ThsrOdFare {
  OriginStationID: string;
  OriginStationName: {
    Zh_tw: string;
    En: string;
  };
  DestinationStationID: string;
  DestinationStationName: {
    Zh_tw: string;
    En: string;
  };
  Direction: number;
  Fares: ThsrFare[];
  SrcUpdateTime: string;
  UpdateTime: string;
  VersionID: number;
}

export interface ThsrFare {
  TicketType: number;
  FareClass: number;
  CabinClass: number;
  Price: number;
}

export interface ThsrDailyFreeSeatingCar {
  AuthorityCode: string;
  FreeSeatingCars: ThsrFreeSeatingCar[];
  TrainDate: string;
  UpdateInterval: string;
  UpdateTime: string;
}

export interface ThsrFreeSeatingCar {
  TrainNo: string;
  CarConfig: string;
  Cars: number[];
}

export interface ThsrTdxGeneralTimeTable {
  UpdateTime: string;
  EffectiveDate: string;
  ExpiringDate: string;
  VersionID: number;
  GeneralTimetable: ThsrGeneralTimeTable;
}

export interface ThsrGeneralTimeTable {
  GeneralTrainInfo: {
    TrainNo: string;
    Direction: number;
    StartingStationID: string;
    StartingStationName: {
      Zh_tw: string;
      En: string;
    };
    EndingStationID: string;
    EndingStationName: {
      Zh_tw: string;
      En: string;
    };
    Note: {};
  };
  StopTimes: {
    StopSequence: number;
    StationID: string;
    StationName: {
      Zh_tw: string;
      En: string;
    };
    DepartureTime?: string;
    ArrivalTime?: string;
  }[];
  ServiceDay: {
    Monday: number;
    Tuesday: number;
    Wednesday: number;
    Thursday: number;
    Friday: number;
    Saturday: number;
    Sunday: number;
  };
  SrcUpdateTime: string;
}

export interface ThsrAlertInfo {
  /** 通阻訊息代碼 */
  AlertID: string;

  /** 通阻訊息標題 */
  Title: string;

  /** 通阻訊息說明 */
  Description: string;

  /** 營運狀況 = ['空白: 正常' or '▲: 其他的異常狀態' or 'X: 全線停止運行'] */
  Status: "" | "▲" | "X";

  /** 影響範圍 */
  Scope: {
    /** 影響路段資訊 */
    LineSections: Array<{
      LineID: string;
      StartingStationID: string;
      StartingStationName: string;
      EndingStationID: string;
      EndingStationName: string;
      Description: string;
    }>;
  };

  /** 影響方向 : [0:'南下',1:'北上',2:'雙向'] */
  Direction: number;

  /** 影響等級程度 : [1:'重度',2:'中度',3:'輕度'] */
  Level: number;

  /** 影響說明 */
  Effect: string;

  /** 影響原因 */
  Reason: string;

  /** 通阻訊息網址連結 */
  AlertURL: string;

  /** 發生日期時間 */
  OccuredTime: string;

  /** 訊息起始日期時間 */
  StartTime: string;

  /** 訊息結束日期時間 */
  EndTime: string;

  /** 訊息發布日期時間(ISO8601格式:yyyy-MM-ddTHH:mm:sszzz) */
  PublishTime: string;

  /** 來源端平台資料更新時間(ISO8601格式:yyyy-MM-ddTHH:mm:sszzz) */
  SrcUpdateTime: string;

  /** 本平台資料更新時間(ISO8601格式:yyyy-MM-ddTHH:mm:sszzz) */
  UpdateTime: string;
}

export interface THSRAvailableSeatStatus {
  UpdateTime: string;
  UpdateInterval: number;
  SrcUpdateTime: string;
  SrcUpdateInterval: number;
  Count: number;
  TrainDate: string;
  AvailableSeats: THSRAvailableSeat[];
}

export interface THSRAvailableSeat {
  TrainNo: string;
  Direction: number;
  OriginStationID: string;
  OriginStationCode: string;
  OriginStationName: NameType;
  DestinationStationID: string;
  DestinationStationCode: string;
  DestinationStationName: NameType;
  StandardSeatStatus: "X" | "L" | "O"; // 售完: X, 即將售完: L, 尚有充足座位: O
  BusinessSeatStatus: "X" | "L" | "O"; // 售完: X, 即將售完: L, 尚有充足座位: O
}

export interface NameType {
  Zh_tw: string;
  En: string;
}

/**
 * 高鐵 Deeplink Web API 請求參數
 */
export interface ThsrDeeplinkWebParams {
  /** 車票類別，S: 單程車票，R: 去回車票 */
  ticket_type: string;
  /** 車廂類別，Y: 標準車廂，J: 商務車廂 */
  carriage_type: string;
  /** 成人票數量，0-10 */
  adult_ticket: number;
  /** 兒童票數量，0-10 */
  children_ticket: number;
  /** 愛心票數量，0-10 */
  disabled_ticket: number;
  /** 長者票數量，0-10 */
  senior_ticket: number;
  /** 學生票數量，0-10 */
  student_ticket: number;
  /** 出發車站名稱，例如：{台北} */
  start_station: string;
  /** 抵達車站名稱，例如：{左營} */
  end_station: string;
  /** 去程日期，格式:{yyyymmdd} */
  departure_date: string;
  /** 去程車次號碼4碼，如為3碼前面請補0 */
  departure_number: string;
  /** 回程日期，格式:{yyyymmdd}，如設定去回車票則為必要參數 */
  return_date?: string;
  /** 回程車次號碼4碼，如為3碼前面請補0，如設定去回車票則為必要參數 */
  return_number?: string;
}

/**
 * 高鐵 Deeplink Web API 回應參數
 */
export interface ThsrDeeplinkWebResponse {
  /** 高鐵訂票網站導訂鏈結網址 */
  deeplink: string;
  /** 連結過期時間 (YYYY-MM-DD HH:mm:ss) */
  expired: string;
}

/**
 * 高鐵 Deeplink Direct API 請求參數
 */
export interface ThsrDeeplinkDirectParams {
  /** 出發車站名稱，例如：{台北} */
  start_station: string;
  /** 抵達車站名稱，例如：{左營} */
  end_station: string;
  /** 乘車日期，格式:{yyyy-mm-dd} */
  train_date: string;
  /** 乘車時間，格式:{hh:mm} */
  train_time: string;
  /** 車次號碼 */
  train_number: number;
}

/**
 * 高鐵 Deeplink Direct API 回應參數
 */
export interface ThsrDeeplinkDirectResponse {
  /** 「T-EX行動購票」APP深度鏈結網址 */
  deeplink: string;
  /** 連結過期時間 (YYYY-MM-DD HH:mm:ss) */
  expired: string;
}
