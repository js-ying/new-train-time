import { apiProxyHandler } from "@/utils/ApiHandlerUtils";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * BFF Proxy：會員跨裝置單點查詢歷史（台鐵單站 / 公車路線，train_type 區分）
 * - GET：取得 server 端歷史（依車種分組）
 * - PUT：批次 upsert（per-row union）
 * - DELETE：清除單一車種歷史（?trainType=TR|BUS）
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const method = req.method || "GET";

  if (method !== "GET" && method !== "PUT" && method !== "DELETE") {
    res.setHeader("Allow", "GET, PUT, DELETE");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // DELETE 帶 ?trainType=... query，需一併轉發給後端
  const query =
    method === "DELETE" && typeof req.query.trainType === "string"
      ? `?trainType=${encodeURIComponent(req.query.trainType)}`
      : "";
  const targetUrl = `${process.env.THSR_TRAIN_TIME_BACKEND_ENDPOINT}/api/users/station-search-history${query}`;

  return apiProxyHandler(req, res, targetUrl, method);
}
