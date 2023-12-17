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

export interface TrStationName {
  Zh_tw: string;
  En: string;
}

export interface TrStopTime {
  StopSequence: number;
  StationID: string;
  StationName: TrStationName;
  ArrivalTime: string;
  DepartureTime: string;
  SuspendedFlag: number;
}

export interface TrFare {
  TicketType: number;
  FareClass: number;
  CabinClass: number;
  Price: number;
}

export interface TrTrainTimeTable {
  TrainInfo: TrTrainInfo;
  StopTimes: TrStopTime[];
  fareList: TrFare[];
}

export interface TrTdxTrainTimeTable {
  UpdateTime: string;
  UpdateInterval: number;
  SrcUpdateTime: string;
  SrcUpdateInterval: number;
  TrainDate: string;
  TrainTimetables: TrTrainTimeTable[];
}