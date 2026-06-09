import { apiProxyHandler } from "@/utils/ApiHandlerUtils";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * BFF Proxy：會員跨裝置常用路線（收藏）同步
 * - GET：取得 server 端收藏（依車種分組）
 * - PUT：整組 replace（add / remove 都走這支）
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const method = req.method || "GET";

  if (method !== "GET" && method !== "PUT") {
    res.setHeader("Allow", "GET, PUT");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const targetUrl = `${process.env.THSR_TRAIN_TIME_BACKEND_ENDPOINT}/api/users/favorite-routes`;

  return apiProxyHandler(req, res, targetUrl, method);
}
