import {
  BusSource,
  JsyBusRoute,
  JsyBusRouteBoard,
  JsyBusRouteInfo,
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
 */
export const getBusRouteArrivals = async (
  routeUid: string,
  source: BusSource,
  city: string | undefined,
  signal?: AbortSignal,
): Promise<JsyBusRouteBoard[]> => {
  const params = new URLSearchParams({ source });
  if (city) params.set("city", city);
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
