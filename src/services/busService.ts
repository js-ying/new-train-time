import {
  BusSource,
  JsyBusNearestStop,
  JsyBusRoute,
  JsyBusRouteBoard,
  JsyBusRouteInfo,
  JsyBusStopBoard,
  JsyBusStopBoardsBatch,
} from "@/models/jsy-bus-info";
import { BusStopFavoriteKey } from "@/utils/BusStopFavoriteUtils";

import fetchData from "./fetchData";
import { optionalAuthHeader } from "./optionalAuth";

/** 公車路線號模糊搜（後端記憶體索引 contains 比對），回候選清單供 autocomplete。 */
export const searchBusRoutes = async (
  q: string,
  limit = 30,
  signal?: AbortSignal,
  /** "en" 時比對英文路線名/方向牌；其餘走中文欄位。 */
  lang?: string,
): Promise<JsyBusRoute[]> => {
  const params = new URLSearchParams({ q, limit: String(limit) });
  if (lang === "en") params.set("lang", "en");
  return await fetchData(
    `/api/bus/routes?${params.toString()}`,
    {},
    "GET",
    signal,
    await optionalAuthHeader(),
  );
};

/**
 * 取某路線雙向即時到站看板（站序骨幹 + N1 已貼合，供輪詢）。
 * source/city 僅作提示：後端一律以 routeUid 反查索引取權威值（缺或帶錯皆可正確查詢）。
 * logQuery：僅初次選定路線時帶（後端 analytics 去重，輪詢不帶）。
 */
export const getBusRouteArrivals = async (
  routeUid: string,
  source: BusSource,
  city: string | undefined,
  subRouteName?: string,
  signal?: AbortSignal,
  logQuery?: boolean,
): Promise<JsyBusRouteBoard[]> => {
  const params = new URLSearchParams({ source });
  if (city) params.set("city", city);
  if (subRouteName) params.set("sub", subRouteName);
  if (logQuery) params.set("log", "1");
  return await fetchData(
    `/api/bus/route/${encodeURIComponent(routeUid)}/arrivals?${params.toString()}`,
    {},
    "GET",
    signal,
    await optionalAuthHeader(),
  );
};

/** 取路線詳細資訊（業者/票價/分段/官方路線圖/定期時刻表）。 */
export const getBusRouteInfo = async (
  routeUid: string,
  source: BusSource,
  city: string | undefined,
  signal?: AbortSignal,
): Promise<JsyBusRouteInfo> => {
  const params = new URLSearchParams({ source });
  if (city) params.set("city", city);
  return await fetchData(
    `/api/bus/route/${encodeURIComponent(routeUid)}/info?${params.toString()}`,
    {},
    "GET",
    signal,
    await optionalAuthHeader(),
  );
};

/** 定位解析最近站牌（回 null 表附近查無站牌）。 */
export const getBusNearestStop = async (
  lat: number,
  lon: number,
  signal?: AbortSignal,
): Promise<JsyBusNearestStop | null> => {
  const params = new URLSearchParams({ lat: String(lat), lon: String(lon) });
  return await fetchData(
    `/api/bus/nearest-stop?${params.toString()}`,
    {},
    "GET",
    signal,
    await optionalAuthHeader(),
  );
};

/** 取某站牌所有路線即時到站看板（單錨 StopUID；source/city/stopName 後端反查 bus_stop）。 */
export const getBusStopBoard = async (
  stopUid: string,
  signal?: AbortSignal,
): Promise<JsyBusStopBoard> => {
  const params = new URLSearchParams({ stopUid });
  return await fetchData(
    `/api/bus/stop-board?${params.toString()}`,
    {},
    "GET",
    signal,
    await optionalAuthHeader(),
  );
};

/** 收藏站點看板：多筆（站牌×路線×方向）一次查到站狀態；會員限定（帶 token）。
 *  userApi 須動態 import：靜態引入會讓本模組捲入 firebase/context 的循環初始化
 *  （/bus SSR 直接 500），且與 userApi 延後載入 firebase chunk 的設計一致。 */
export const getBusStopBoardsBatch = async (
  items: BusStopFavoriteKey[],
  signal?: AbortSignal,
): Promise<JsyBusStopBoardsBatch> => {
  const { callUserApi } = await import("./userApi");
  return callUserApi<JsyBusStopBoardsBatch>({
    url: "/api/bus/stop-boards-batch",
    method: "POST",
    body: { items },
    signal,
  });
};
