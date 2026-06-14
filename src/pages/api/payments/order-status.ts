import { apiProxyHandler } from "@/utils/ApiHandlerUtils";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * BFF Proxy：查本人單筆訂單狀態（導回頁輪詢用）
 * - GET ?mtn=...：轉發 Authorization Bearer 給後端
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const method = req.method || "GET";

  if (method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // 訂單狀態與本人綁定，禁止任何 HTTP 快取層留存
  res.setHeader("Cache-Control", "no-store");
  const mtn = encodeURIComponent((req.query.mtn as string) ?? "");
  const targetUrl = `${process.env.THSR_TRAIN_TIME_BACKEND_ENDPOINT}/api/payments/order-status?mtn=${mtn}`;
  return apiProxyHandler(req, res, targetUrl, "GET");
}
