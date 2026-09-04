/**
 * 公車路線識別 server-only fetch（供 /bus getServerSideProps 產 SEO 標題）。
 * 路線頁 URL 只帶 routeUid，路線名需向後端索引反查；僅取識別資訊，不含站序 / 即時到站。
 * 後端對「格式合法但查無」回 404，據此區分「路線不存在」與「後端故障 / 逾時」——
 * 前者可安全 noindex，後者不可（一次故障會讓正常路線頁全被 deindex）。
 */
import { JsyBusRoute } from "@/models/jsy-bus-info";
import { clientIpForwardHeaders } from "@/utils/ApiHandlerUtils";
import type { GetServerSidePropsContext } from "next";

const FETCH_TIMEOUT_MS = 2000;

export interface BusRouteMetaResult {
  /** 命中的路線識別；查無或取數失敗為 null */
  route: JsyBusRoute | null;
  /** 後端明確回 404（路線不存在）；逾時 / 故障不算 */
  notFound: boolean;
}

export async function fetchBusRouteMetaServerSide(
  routeUid: string,
  subRouteName: string | null,
  req: GetServerSidePropsContext["req"],
): Promise<BusRouteMetaResult> {
  const endpoint = process.env.THSR_TRAIN_TIME_BACKEND_ENDPOINT;
  if (!endpoint) return { route: null, notFound: false };

  const params = new URLSearchParams();
  if (subRouteName) params.set("sub", subRouteName);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(
      `${endpoint}/api/bus/route/${encodeURIComponent(routeUid)}/meta?${params.toString()}`,
      { headers: clientIpForwardHeaders(req), signal: controller.signal },
    );
    if (res.status === 404) return { route: null, notFound: true };
    if (!res.ok) return { route: null, notFound: false };
    return { route: (await res.json()) as JsyBusRoute, notFound: false };
  } catch {
    return { route: null, notFound: false };
  } finally {
    clearTimeout(timeout);
  }
}
