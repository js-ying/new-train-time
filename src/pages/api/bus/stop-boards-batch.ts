import { apiProxyHandler } from "@/utils/ApiHandlerUtils";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * BFF Proxy：收藏站點看板（多筆站牌×路線×方向一次查到站；會員限定，轉發 token）
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const targetUrl = `${process.env.THSR_TRAIN_TIME_BACKEND_ENDPOINT}/api/bus/stop-boards-batch`;

  return apiProxyHandler(req, res, targetUrl, "POST");
}
