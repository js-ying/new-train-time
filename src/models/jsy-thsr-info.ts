export interface JsyThsrInfo {
  timeTable: JsyTimeTable[];
  fareList: ThsrOdFare[];
  freeSeatingCars: ThsrFreeSeatingCar[];
  generalTimeTable: ThsrTdxGeneralTimeTable[];
}

export interface JsyTimeTable extends ThsrDailyTimetable {
  standardSeatStatus: "X" | "L" | "O" | null;
  businessSeatStatus: "X" | "L" | "O" | null;
}

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
