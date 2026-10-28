/**
 * 熱門單站 Jsy 契約（camelCase；對應後端 /api/popular-stations 回傳）。
 * 純型別 + 靜態 fallback，可同時被 getServerSideProps（server）與元件（client）安全 import。
 */

import { JsyBusRoute } from "./jsy-bus-info";

/** 單筆熱門單站（stationId 對 TR 是站號、對 BUS 是 routeUid 或 routeUid|子線名） */
export interface JsyPopularStation {
  stationId: string;
  stationName?: string;
  /** BUS 才有：索引中的路線（組路線頁標題與連結） */
  busRoute?: JsyBusRoute;
}

/**
 * 寫死 fallback：部署當下後端不可達、或某 train_type 無資料時使用，確保裸站頁 / 公車首頁永遠有可爬
 * 內部連結。TR 取實際查詢熱度高的站；BUS 取各地常見幹線，routeUid（含子線）須存在於路線索引。
 * key 對齊後端 train_type。
 */
export const FALLBACK_POPULAR_STATIONS: Record<string, JsyPopularStation[]> = {
  TR: [
    { stationId: "1000", stationName: "臺北" },
    { stationId: "1080", stationName: "桃園" },
    { stationId: "3360", stationName: "彰化" },
    { stationId: "4340", stationName: "新左營" },
    { stationId: "4400", stationName: "高雄" },
    { stationId: "4220", stationName: "臺南" },
  ],
  BUS: [
    {
      stationId: "TPE16111",
      stationName: "307",
      busRoute: {
        routeUid: "TPE16111",
        routeName: "307",
        routeNameEn: "307",
        source: "city",
        city: "Taipei",
        departureStop: "板橋",
        destinationStop: "撫遠街",
        departureStopEn: "Banqiao",
        destinationStopEn: "Fuyuan St.",
        routeType: 11,
      },
    },
    {
      stationId: "NWT16591",
      stationName: "857",
      busRoute: {
        routeUid: "NWT16591",
        routeName: "857",
        routeNameEn: "857",
        source: "city",
        city: "NewTaipei",
        departureStop: "淡海",
        destinationStop: "板橋",
        routeType: 11,
      },
    },
    {
      stationId: "TXG300",
      stationName: "300",
      busRoute: {
        routeUid: "TXG300",
        routeName: "300",
        routeNameEn: "300",
        source: "city",
        city: "Taichung",
        departureStop: "靜宜大學",
        destinationStop: "臺中車站",
        departureStopEn: "Providence University",
        destinationStopEn: "Taichung Station",
        routeType: 11,
      },
    },
    {
      stationId: "TNN1200",
      stationName: "藍幹線",
      busRoute: {
        routeUid: "TNN1200",
        routeName: "藍幹線",
        routeNameEn: "Blue",
        source: "city",
        city: "Tainan",
        departureStop: "安工區",
        destinationStop: "佳里",
        departureStopEn: "Anping Industrial Park",
        destinationStopEn: "Jiali",
        routeType: 11,
      },
    },
    {
      stationId: "KHH2071",
      stationName: "168環東",
      busRoute: {
        routeUid: "KHH2071",
        routeName: "168環東",
        routeNameEn: "168E Main Line",
        source: "city",
        city: "Kaohsiung",
        departureStop: "金獅湖站",
        destinationStop: "愛之船國賓站",
        departureStopEn: "Golden Lion Lake Station",
        destinationStopEn: "Love Boat(Ambassador Hotel)",
        routeType: 11,
      },
    },
    {
      stationId: "THB2011|2011",
      stationName: "2011",
      busRoute: {
        routeUid: "THB2011",
        routeName: "2011",
        routeNameEn: "2011",
        subRouteName: "2011",
        source: "intercity",
        departureStop: "臺北轉運站",
        destinationStop: "新竹轉運站",
        departureStopEn: "Taipei Bus Station",
        destinationStopEn: "Hsinchu bus station",
        headsign: "臺北市→新竹轉運站",
        headsignEn: "Taipei City→Hsinchu bus station",
        routeType: 13,
      },
    },
  ],
};
