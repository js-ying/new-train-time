import { JsyAnnouncement } from "./jsy-announcement";

export interface TrDailyTrainTimetable {
  UpdateTime: string;
  UpdateInterval: number;
  SrcUpdateTime: string;
  SrcUpdateInterval: number;
  TrainDate: string;
  TrainTimetables: JsyTrTrainTimeTable[];
  announcements?: JsyAnnouncement[];
}

export interface JsyTrTrainTimeTable {
  TrainInfo: TrTrainInfo;
  StopTimes: TrStopTime[];
  fareList: TrOfFare[];
  delayInfo: TrDelayInfo[];
  trainDate: string;
}

export interface TrTrainInfo {
  TrainNo: string;
  Direction: number;
  TrainTypeID: string;
  TrainTypeCode: string;
  TrainTypeName: {
    Zh_tw: string;
    En: string;
  };
  TripHeadSign: string;
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
  TripLine: number;
  WheelChairFlag: number;
  PackageServiceFlag: number;
  DiningFlag: number;
  BreastFeedFlag: number;
  BikeFlag: number;
  CarFlag: number;
  DailyFlag: number;
  ExtraTrainFlag: number;
  SuspendedFlag: number;
  Note: string;
}

export interface TrStopTime {
  StopSequence: number;
  StationID: string;
  StationName: TrStationName;
  ArrivalTime: string;
  DepartureTime: string;
  SuspendedFlag: number;
}

export interface TrOfFare {
  TicketType: number;
  FareClass: number;
  CabinClass: number;
  Price: number;
}

export interface TrStationName {
  Zh_tw: string;
  En: string;
}

export interface TrDelayInfo {
  DelayTime: number;
}

/**
 * 台鐵通阻訊息列表
 */
export interface TraAlert {
  /** 本平台資料更新時間(ISO8601格式:yyyy-MM-ddTHH:mm:sszzz) */
  UpdateTime: string;
  /** 本平台資料更新週期(秒) */
  UpdateInterval: number;
  /** 來源端平台資料更新時間(ISO8601格式:yyyy-MM-ddTHH:mm:sszzz) */
  SrcUpdateTime: string;
  /** 來源端平台資料更新週期(秒)['-1: 不定期更新'] */
  SrcUpdateInterval: number;
  /** 業管機關簡碼 */
  AuthorityCode: string;
  /** 資料(陣列) */
  Alerts: {
    /** 通阻訊息代碼 */
    AlertID: string;
    /** 通阻訊息標題 */
    Title: string;
    /** 通阻訊息說明 */
    Description: string;
    /** 營運狀況 : [0:'全線營運停止',1:'全線營運正常',2:'有異常狀況'] */
    Status: number;
    /** 影響範圍 */
    Scope: {
      /** 受影響的路網 */
      Network: {
        /** 路網代碼 */
        NetworkID: string;
        /** 路網名稱 */
        NetworkName: string;
      };
      /** 受影響的車站 */
      Stations: Array<{
        /** 車站代碼 */
        StationID: string;
        /** 車站名稱 */
        StationName: string;
      }>;
      /** 受影響的實體路線 */
      Lines: Array<{
        /** 實體路線代碼 */
        LineID: string;
        /** 實體路線名稱 */
        LineName: string;
      }>;
      /** 受影響的營運路線 */
      Routes: Array<{
        /** 營運路線代碼 */
        RouteID: string;
        /** 營運路線名稱 */
        RouteName: string;
      }>;
      /** 受影響的車次 */
      Trains: Array<{
        /** 受影響的車次 */
        TrainNo: string;
      }>;
      /** 受影響的路線區間 */
      LineSections: Array<{
        /** 路線區間所在路線代碼 */
        LineID: string;
        /** 區間起站車站代碼 */
        StartingStationID: string;
        /** 區間起站車站名稱 */
        StartingStationName: string;
        /** 區間迄站車站代碼 */
        EndingStationID: string;
        /** 區間迄站車站名稱 */
        EndingStationName: string;
        /** 影響區間輔助描述 */
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
    /** 訊息起始日期時間 */
    StartTime: string;
    /** 訊息結束日期時間 */
    EndTime: string;
    /** 消息發佈日期時間 */
    PublishTime: string;
    /** 消息更新日期時間 */
    UpdateTime: string;
  }[];
  /** 資料總筆數 */
  Count: number;
}

/**
 * 台鐵 Deeplink Web API 請求參數
 */
export interface TraDeeplinkWebParams {
  start_station: string;
  end_station: string;
  departure_date: string;
  departure_number: string;
  ticket_type: number;
  ticket_count: number;
}

/**
 * 台鐵 Deeplink Web API 回應參數
 */
export interface TraDeeplinkWebResponse {
  deeplink: string;
  expired: string; // YYYY-MM-DD HH:mm:ss
}

/**
 * 台鐵 Deeplink Direct API 請求參數
 */
export interface TraDeeplinkDirectParams {
  start_station: string;
  end_station: string;
  train_date: string;
  train_number: number;
}

/**
 * 台鐵 Deeplink Direct API 回應參數
 */
export interface TraDeeplinkDirectResponse {
  deeplink: string;
  expired: string; // YYYY-MM-DD HH:mm:ss
}
