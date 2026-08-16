/**
 * 公車路線頁 sitemap：於 server 端即時組出，隨路線索引更新自動同步。
 * 取數失敗回 503 而非空 urlset，讓爬蟲稍後重試而非視為「沒有 URL」。
 */
import { clientIpForwardHeaders } from "@/utils/ApiHandlerUtils";
import type { GetServerSideProps } from "next";

const SITE_URL = "https://traintime.jsy.tw";
const FETCH_TIMEOUT_MS = 8000;

interface BusRouteKey {
  routeUid: string;
  subRouteName?: string;
}

/** XML 屬性/內文跳脫（子線名可能含 & < > 等字元）。 */
const escapeXml = (s: string): string =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;",
      })[c] as string,
  );

/** 組單一路線頁的相對路徑（與 useSeo 的 canonical 規則一致：只帶 routeUid + 子線）。 */
const routePath = ({ routeUid, subRouteName }: BusRouteKey): string => {
  const sub = subRouteName
    ? `&sub=${encodeURIComponent(subRouteName)}`
    : "";
  return `/bus?routeUid=${encodeURIComponent(routeUid)}${sub}`;
};

/** 取全索引路線鍵；取數失敗回 null（與「索引就緒但為空」區分，供上層決定回 503）。 */
const fetchRouteKeys = async (
  req: Parameters<GetServerSideProps>[0]["req"],
): Promise<BusRouteKey[] | null> => {
  const endpoint = process.env.THSR_TRAIN_TIME_BACKEND_ENDPOINT;
  if (!endpoint) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(`${endpoint}/api/bus/routes/keys`, {
      headers: clientIpForwardHeaders(req),
      signal: controller.signal,
    });
    if (!res.ok) return null;
    return (await res.json()) as BusRouteKey[];
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
};

/** 每條路線出 zh-Hant / en 兩筆 <url>，各自掛完整 hreflang cluster（與既有 sitemap 一致）。 */
const buildSitemap = (keys: BusRouteKey[]): string => {
  const urls = keys
    .flatMap((key) => {
      const path = routePath(key);
      const zhHref = escapeXml(`${SITE_URL}${path}`);
      const enHref = escapeXml(`${SITE_URL}/en${path}`);
      const alternates =
        `<xhtml:link rel="alternate" hreflang="zh-Hant" href="${zhHref}"/>` +
        `<xhtml:link rel="alternate" hreflang="en" href="${enHref}"/>` +
        `<xhtml:link rel="alternate" hreflang="x-default" href="${zhHref}"/>`;
      return [zhHref, enHref].map(
        (loc) =>
          `<url><loc>${loc}</loc><changefreq>weekly</changefreq><priority>0.6</priority>${alternates}</url>`,
      );
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}</urlset>`;
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const keys = await fetchRouteKeys(req);

  // 取數失敗或索引未就緒時回 503：比回「合法但空的 sitemap」誠實，讓爬蟲稍後重試
  if (!keys?.length) {
    res.statusCode = 503;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.end("bus route index unavailable");
    return { props: {} };
  }

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  // 索引每日刷新，給 CDN 一小時新鮮期；過期後容許先發舊版再背景更新
  res.setHeader(
    "Cache-Control",
    "public, max-age=3600, stale-while-revalidate=86400",
  );
  res.write(buildSitemap(keys));
  res.end();

  return { props: {} };
};

const BusSitemap = () => null;

export default BusSitemap;
