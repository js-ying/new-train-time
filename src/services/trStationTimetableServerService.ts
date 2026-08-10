/**
 * 單站時刻表 server-only fetch（供 /station getServerSideProps SSR 用）。
 *
 * GSSP 在 Next server 上執行、可達內網後端，故直接打後端取數寫進 HTML（爬蟲可讀）；
 * 轉發原請求的 client IP headers 供後端辨識真實來源（log / per-IP 限流）。
 * 任何失敗（無 endpoint、逾時、非 2xx）一律回 null，由 client 端 hook 首載時自行補抓。
 */
import { JsyTrStationTimetable } from "@/models/jsy-tr-info";
import { clientIpForwardHeaders } from "@/utils/ApiHandlerUtils";
import type { GetServerSidePropsContext } from "next";

const FETCH_TIMEOUT_MS = 4000;

export async function fetchTrStationTimetableServerSide(
  stationId: string,
  req: GetServerSidePropsContext["req"],
): Promise<JsyTrStationTimetable | null> {
  const endpoint = process.env.THSR_TRAIN_TIME_BACKEND_ENDPOINT;
  if (!endpoint) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(`${endpoint}/api/getJsyTrStationTimetable`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...clientIpForwardHeaders(req),
      },
      body: JSON.stringify({ stationId }),
      signal: controller.signal,
    });
    if (!res.ok) return null;
    return (await res.json()) as JsyTrStationTimetable;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
