export interface JsyThsrTrainTimeTable {
  timeTable: ThsrDailyTimetable[];
  fareList: ThsrOdFare[];
  dailyFreeSeatingCar: ThsrDailyFreeSeatingCar;
  generalTimeTable: ThsrTdxGeneralTimeTable[];
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
