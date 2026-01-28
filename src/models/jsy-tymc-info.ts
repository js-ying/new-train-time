import { JsyAnnouncement } from "./jsy-announcement";

export interface JsyTymcInfo {
  startStationId: string;
  endStationId: string;
  date: string;
  time: string;
  timeTables: MetroStationTimeTableTYMC["Timetables"];
  fareList: MetroODFareTYMC["Fares"];
  announcements: JsyAnnouncement[];
}

// 含 jsy 客製欄位
export interface MetroStationTimeTableTYMC {
  RouteID: string;
  LineID: string;
  StationID: string;
  StationName: {
    Zh_tw: string; // 中文繁體名稱
    En: string; // 英文名稱
  };
  Direction: number; // 營運路線方向描述 : [0:'去程',1:'返程']
  DestinationStaionID: string;
  DestinationStationName: {
    Zh_tw: string;
    En: string;
  };
  Timetables: {
    Sequence: number; // 發車順序
    TrainNo: string; // 車次號碼(捷運通常沒有車次號碼)
    ArrivalTime: string; // 到站時刻(hh:mm)
    DepartureTime: string; // 發車時刻(hh:mm)
    jsyArrivalTime: string; // [客製] 抵達 endStation 時刻(hh:mm)
    jsyRunTime: string; // [客製] 行駛時間
    TrainType?: number; // 車種(0:不分車種, 1:普通車, 2:直達車)
    StoppingPatternID?: string; // 停站模式代碼
    jsyStoppingPatternName?: string; // [客製] 停站模式名稱
    jsyStoppingStationIdList?: string[]; // [客製] 停站車站清單
    jsyFareList: MetroODFareTYMC["Fares"]; // [客製] 票價
  }[];
  ServiceDay: {
    ServiceTag: string; // 營運日標籤
    Monday: boolean; // 星期一營運與否
    Tuesday: boolean;
    Wednesday: boolean;
    Thursday: boolean;
    Friday: boolean;
    Saturday: boolean;
    Sunday: boolean;
    NationalHolidays: boolean; // 國定假日營運與否
  };
  SpecialDays: {
    SaterDate: string; // 開始時間
    EndDate: string; // 結束時間
    Description: string; // 描述
  }[];
  SrcUpdateTime: string; // ISO8601格式
  UpdateTime: string; // ISO8601格式
  VersionID: number;
}

export interface MetroAlertTYMC {
  /** 資料更新時間 */
  UpdateTime: string;
  /** 更新間隔 */
  UpdateInterval: number;
  /** 來源更新時間 */
  SrcUpdateTime: string;
  /** 來源更新間隔 */
  SrcUpdateInterval: number;
  /** 權限代碼 */
  AuthorityCode: string;
  /** 警報資料陣列 */
  Alerts: {
    /** 通阻訊息代碼 */
    AlertID: string;
    /** 通阻訊息標題 */
    Title: string;
    /** 通阻訊息說明 */
    Description: string;
    /** 營運狀況: 0-全線營運停止, 1-全線營運正常, 2-有異常狀況 */
    Status: number;
    /** 影響範圍 */
    Scope: {
      /** 受影響的路網 */
      Network: {
        /** 路網代碼 */
        NetworkID: string;
      };
      /** 受影響的車站列表 */
      Stations: {
        /** 車站代碼 */
        StationID: string;
        /** 車站名稱 */
        StationName: string;
      }[];
      /** 受影響的實體路線列表 */
      Lines: {
        /** 實體路線代碼 */
        LineID: string;
        /** 實體路線名稱 */
        LineName: string;
      }[];
      /** 受影響的營運路線列表 */
      Routes: {
        /** 營運路線代碼 */
        RouteID: string;
        /** 營運路線名稱 */
        RouteName: string;
      }[];
      /** 受影響的車次列表 */
      Trains: {
        /** 受影響的車次 */
        TrainNo: string;
      }[];
      /** 受影響的路線區間列表 */
      LineSections: {
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
      }[];
    };
    /** 影響方向: 0-去程, 1-返程 */
    Direction: number;
    /** 影響等級程度: 1-重度, 2-中度, 3-輕度 */
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

export interface MetroStationOfLineTYMC {
  /** 路線編號 */
  LineNo: string;
  /** 路線 ID */
  LineID: string;
  /** 路線車站資訊 */
  Stations: {
    /** 站點順序 */
    Sequence: number;
    /** 站點 ID */
    StationID: string;
    /** 站點名稱 */
    StationName: {
      /** 中文繁體名稱 */
      Zh_tw: string;
      /** 英文名稱 */
      En: string;
    };
    /** 已累積之里程距離(公里) */
    CumulativeDistance: number;
  }[];
  /** 來源端平台資料更新時間(ISO8601格式) */
  SrcUpdateTime: string;
  /** 本平台資料更新時間(ISO8601格式) */
  UpdateTime: string;
  /** 資料版本編號 */
  VersionID: number;
}

export interface MetroStoppingPatternTYMC {
  /** 本平台資料更新時間(ISO8601格式) */
  UpdateTime: string;
  /** 本平台資料更新頻率(秒) */
  UpdateInterval: number;
  /** 來源端平台資料更新時間(ISO8601格式) */
  SrcUpdateTime: string;
  /** 來源端平台資料更新頻率(秒) */
  SrcUpdateInterval: number;
  /** 業管機關簡碼 */
  AuthorityCode: string;
  /** 停站模式資料陣列 */
  StoppingPatterns: {
    /** 停站模式代碼 */
    StoppingPatternID: string;
    /** 停站模式名稱 */
    StoppingPatternName: {
      /** 中文繁體名稱 */
      Zh_tw: string;
      /** 英文名稱 */
      En: string;
    };
    /** 營運路線代碼 */
    RouteID: string;
    /** 停站資訊 */
    Stations: {
      /** 站序 */
      Sequence: number;
      /** 車站代碼 */
      StationID: string;
      /** 車站名稱 */
      StationName: {
        /** 中文繁體名稱 */
        Zh_tw: string;
        /** 英文名稱 */
        En: string;
      };
      /** 已累積之里程距離(公里) */
      CumulativeDistance: number;
      /** 已累積的旅行時間(分) */
      TravelTime: number;
    }[];
  }[];
  /** 資料總筆數 */
  Count: number;
}

export interface MetroS2STravelTimeTYMC {
  LineNo: string; // 營運路線所屬之路線編號
  LineID: string; // 營運路線所屬之路線代碼
  RouteID: string; // 營運路線代碼
  TrainType: number; // 車種(0:不分車種, 1:普通車, 2:直達車)

  TravelTimes: {
    Sequence: number; // 順序編號
    FromStationID: string;
    FromStationName: {
      Zh_tw: string; // 起站中文名稱
      En: string; // 起站英文名稱
    };
    ToStationID: string;
    ToStationName: {
      Zh_tw: string; // 迄站中文名稱
      En: string; // 迄站英文名稱
    };
    RunTime: number; // 行駛時間
    StopTime: number; // 停留時間
  }[];

  SrcUpdateTime: string; // 來源端平台資料更新時間(ISO8601格式)
  UpdateTime: string; // 本平台資料更新時間(ISO8601格式)
  VersionID: number; // 資料版本編號
}

export interface MetroODFareTYMC {
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
  Fares: Array<{
    TicketType: number; // 1:一般票 2:來回票 3:電子票證 4:回數票 5:定期票30天 6:定期票60天
    FareClass: number; // 1:成人 2:學生 3:孩童 4:敬老 5:愛心 6:愛心孩童 7:愛心優待/愛心陪伴 8:團體
    SaleType: string; // 1:現場櫃台 2:現場機器 3:線上 99:其他
    CitizenCode: string; // TPE:臺北市 NWT:新北市 OTHERS:其他
    Price: number; // 新台幣
  }>;
  TravelTime: number; // 分鐘
  TravelDistance: number; // 公里
  SrcUpdateTime: string; // ISO8601: yyyy-MM-ddTHH:mm:sszzz
  UpdateTime: string; // ISO8601: yyyy-MM-ddTHH:mm:sszzz
  VersionID: number;
}
