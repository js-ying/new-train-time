import {
  BusSource,
  JsyBusNearestStop,
  JsyBusRoute,
  JsyBusRouteBoard,
  JsyBusRouteInfo,
  JsyBusStopBoard,
} from "@/models/jsy-bus-info";

import fetchData from "./fetchData";

/** 公車路線號模糊搜（後端記憶體索引 contains 比對），回候選清單供 autocomplete。 */
export const searchBusRoutes = async (
  q: string,
  limit = 30,
  signal?: AbortSignal,
): Promise<JsyBusRoute[]> => {
  const params = new URLSearchParams({ q, limit: String(limit) });
  return await fetchData(
    `/api/bus/routes?${params.toString()}`,
    {},
    "GET",
    signal,
  );
};

/**
 * 取某路線雙向即時到站看板（站序骨幹 + N1 已貼合，供輪詢）。
 * source 必填；source=city 時 city 亦必填（否則後端回 INVALID_INPUT）。
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
  );
};

/** 取某站牌所有路線即時到站看板（供輪詢）。 */
export const getBusStopBoard = async (
  city: string,
  stopName: string,
  signal?: AbortSignal,
): Promise<JsyBusStopBoard> => {
  const params = new URLSearchParams({ city, stopName });
  return await fetchData(
    `/api/bus/stop-board?${params.toString()}`,
    {},
    "GET",
    signal,
  );
};
