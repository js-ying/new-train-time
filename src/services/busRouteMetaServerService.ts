/**
 * 公車路線識別 server-only fetch（供 /bus getServerSideProps 產 SEO 標題）。
 * 路線頁 URL 只帶 routeUid，路線名需向後端索引反查；僅取識別資訊，不含站序 / 即時到站。
 * 任何失敗一律回 null，頁面照常渲染並退回通用 title。
 */
import { JsyBusRoute } from "@/models/jsy-bus-info";
import { clientIpForwardHeaders } from "@/utils/ApiHandlerUtils";
import type { GetServerSidePropsContext } from "next";

const FETCH_TIMEOUT_MS = 2000;

export async function fetchBusRouteMetaServerSide(
  routeUid: string,
  subRouteName: string | null,
  req: GetServerSidePropsContext["req"],
): Promise<JsyBusRoute | null> {
  const endpoint = process.env.THSR_TRAIN_TIME_BACKEND_ENDPOINT;
  if (!endpoint) return null;

  const params = new URLSearchParams();
  if (subRouteName) params.set("sub", subRouteName);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(
      `${endpoint}/api/bus/route/${encodeURIComponent(routeUid)}/meta?${params.toString()}`,
      { headers: clientIpForwardHeaders(req), signal: controller.signal },
    );
    if (!res.ok) return null;
    return (await res.json()) as JsyBusRoute;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
