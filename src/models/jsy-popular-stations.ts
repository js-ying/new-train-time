/**
 * 熱門單站 Jsy 契約（camelCase；對應後端 /api/popular-stations 回傳）。
 * 純型別 + 靜態 fallback，可同時被 getServerSideProps（server）與元件（client）安全 import。
 */

/** 單筆熱門單站（stationId 對 TR 是站號、對未來 BUS 是路線 id） */
export interface JsyPopularStation {
  stationId: string;
  stationName?: string;
}

/**
 * 寫死 fallback：部署當下後端不可達、或某 train_type 無資料時使用，確保裸站頁永遠有可爬
 * 內部連結。內容取自實際查詢熱度的 TR 高熱門站。key 對齊後端 train_type。
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
};
