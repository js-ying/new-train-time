/**
 * 熱門路線 service（server-only，供首頁 getStaticProps 使用）。
 *
 * 首頁走 ISR（revalidate 1 天），故熱門路線在「build / 每日背景重生」時才向後端取一次、
 * 序列化進 pageProps 由元件 SSR 渲染為可爬的內部連結；不走 client fetch、不走
 * getServerSideProps，對機器零 per-request 負擔。後端不可達 / 逾時一律 fallback。
 */
import {
  FALLBACK_POPULAR_ROUTES,
  JsyPopularRoutes,
} from "@/models/jsy-popular-routes";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

/** 後端取數逾時（毫秒）：避免 build 期後端緩慢拖垮整個產頁流程 */
const FETCH_TIMEOUT_MS = 3000;

/**
 * 向後端取三鐵路熱門路線；任何失敗（無 endpoint、逾時、非 2xx、空資料）回 null，
 * 交由呼叫端 fallback。沿用與 getJsyTrInfo 相同的後端 endpoint env。
 */
async function fetchPopularRoutes(): Promise<JsyPopularRoutes | null> {
  const endpoint = process.env.THSR_TRAIN_TIME_BACKEND_ENDPOINT;
  if (!endpoint) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(`${endpoint}/api/popular-routes`, {
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const data = (await res.json()) as JsyPopularRoutes;
    // 健全性檢查：三鐵路全空視為異常 → 用 fallback
    if (!data || (!data.TR?.length && !data.THSR?.length && !data.TYMC?.length)) {
      return null;
    }
    return data;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * 三個 home 頁（/、/THSR、/TYMC）共用的 getStaticProps：併行取 i18n 與熱門路線，
 * 熱門路線取不到時用 FALLBACK_POPULAR_ROUTES，確保 props 永遠有可渲染資料。
 */
export async function getHomeStaticProps(locale: string) {
  const [translations, popularRoutes] = await Promise.all([
    serverSideTranslations(locale),
    fetchPopularRoutes(),
  ]);

  return {
    props: {
      ...translations,
      popularRoutes: popularRoutes ?? FALLBACK_POPULAR_ROUTES,
    },
    // ISR revalidate 設 1 小時：build 在 CI 上跑、連不到 server 內網後端，故部署當下烤進
    // 去的是 fallback；靠此窗口讓 server 端背景重生時改抓 DB 真值。縮短窗口＝部署後最多
    // 1 小時內自我修復成 DB 版。熱門路線資料變動極慢（query_count 為累積值），不需更頻繁；
    // 後端另有 6h 記憶體快取，頻繁重生也只 1 次 DB 查/6h。
    revalidate: 3600,
  };
}
