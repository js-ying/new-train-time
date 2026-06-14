import { apiProxyHandler } from "@/utils/ApiHandlerUtils";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // 帶會員 PII / 權限，禁止任何 HTTP 快取層留存（SW Workbox 快取另由 next.config 排除）
  res.setHeader("Cache-Control", "no-store");
  const targetUrl = `${process.env.THSR_TRAIN_TIME_BACKEND_ENDPOINT}/api/users/me`;
  return apiProxyHandler(req, res, targetUrl, req.method || "GET");
}
