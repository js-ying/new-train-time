import { apiProxyHandler } from "@/utils/ApiHandlerUtils";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * BFF Proxy：使用者「我確定此查詢條件有轉乘方案」錯誤回報
 * 後端走 /api/transfer-reports（RESTful），這層只負責轉發。
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const targetUrl = `${process.env.THSR_TRAIN_TIME_BACKEND_ENDPOINT}/api/transfer-reports`;
  return apiProxyHandler(req, res, targetUrl, "POST");
}
