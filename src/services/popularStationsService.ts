/**
 * 熱門單站 service（server-only，供 /station getServerSideProps 使用）。
 * 向後端取某 train_type 的 top N 熱門單站；失敗 / 逾時 / 空一律回寫死 fallback，
 * 確保裸站頁永遠有可爬的內部連結。沿用與 getJsyTrInfo 相同的後端 endpoint env。
 */
import {
  FALLBACK_POPULAR_STATIONS,
  JsyPopularStation,
} from "@/models/jsy-popular-stations";

/** 後端取數逾時（毫秒）：避免後端緩慢拖垮 SSR */
const FETCH_TIMEOUT_MS = 3000;

/** 取某 train_type 熱門單站；任何失敗回 fallback（該 train_type 無 fallback 則空陣列） */
export async function fetchPopularStations(
  trainType: string,
): Promise<JsyPopularStation[]> {
  const fallback = FALLBACK_POPULAR_STATIONS[trainType] ?? [];
  const endpoint = process.env.THSR_TRAIN_TIME_BACKEND_ENDPOINT;
  if (!endpoint) return fallback;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(
      `${endpoint}/api/popular-stations?trainType=${encodeURIComponent(trainType)}`,
      { signal: controller.signal },
    );
    if (!res.ok) return fallback;
    const data = (await res.json()) as JsyPopularStation[];
    if (!Array.isArray(data) || data.length === 0) return fallback;
    return data;
  } catch {
    return fallback;
  } finally {
    clearTimeout(timeout);
  }
}
