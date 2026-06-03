/**
 * 熱門路線 Jsy 契約 (camelCase；對應後端 /api/popular-routes 回傳)。
 *
 * 純型別 + 靜態 fallback 常數，無 server-only 相依，可同時被
 * getStaticProps（server）與 PopularRoutes 元件（client）安全 import。
 */

/** 單筆熱門路線（起訖站號） */
export interface JsyPopularRoute {
  startStationId: string;
  endStationId: string;
}

/** 三鐵路熱門路線對照表（key 對齊後端 TrainType：TR / THSR / TYMC） */
export interface JsyPopularRoutes {
  TR: JsyPopularRoute[];
  THSR: JsyPopularRoute[];
  TYMC: JsyPopularRoute[];
}

/**
 * 寫死 fallback：build 期後端不可達、查詢失敗、或某鐵路無資料時使用，確保首頁永遠有
 * 熱門路線可顯示與被爬取。內容沿用上線前的 GA4 熱門路線。
 */
export const FALLBACK_POPULAR_ROUTES: JsyPopularRoutes = {
  TR: [
    { startStationId: "1000", endStationId: "1080" }, // 臺北 - 桃園
    { startStationId: "4220", endStationId: "4400" }, // 臺南 - 高雄
    { startStationId: "1100", endStationId: "1000" }, // 中壢 - 臺北
    { startStationId: "6000", endStationId: "4400" }, // 屏東 - 高雄
    { startStationId: "1210", endStationId: "1000" }, // 新竹 - 臺北
    { startStationId: "1000", endStationId: "0900" }, // 臺北 - 基隆
  ],
  THSR: [
    { startStationId: "1030", endStationId: "1040" }, // 新竹 - 台中
    { startStationId: "1000", endStationId: "1040" }, // 台北 - 台中
    { startStationId: "1070", endStationId: "1000" }, // 左營 - 台北
    { startStationId: "1040", endStationId: "1000" }, // 台中 - 台北
    { startStationId: "1000", endStationId: "1070" }, // 台北 - 左營
    { startStationId: "1040", endStationId: "1020" }, // 台中 - 桃園
  ],
  TYMC: [
    { startStationId: "A1", endStationId: "A13" }, // 台北車站 - 機場第二航廈
    { startStationId: "A1", endStationId: "A12" }, // 台北車站 - 機場第一航廈
    { startStationId: "A18", endStationId: "A12" }, // 高鐵桃園站 - 機場第一航廈
    { startStationId: "A18", endStationId: "A13" }, // 高鐵桃園站 - 機場第二航廈
    { startStationId: "A3", endStationId: "A13" }, // 新北產業園區站 - 機場第二航廈
    { startStationId: "A1", endStationId: "A8" }, // 台北車站 - 長庚醫院站
  ],
};
