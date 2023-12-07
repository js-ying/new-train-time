export enum SearchAreaActiveIndexEnum {
  EMPTY = null,
  START_STATION = 0,
  END_STATION = 1,
  DATE_TIME = 2,
}

export enum SearchAreaLayerEnum {
  FIRST_LAYER = 0, // 台鐵: 縣市, 高鐵: 車站
  SECOND_LAYER = 1, // 台鐵: 車站, 高鐵: 無
}
