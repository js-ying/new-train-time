import { apiProxyHandler } from "@/utils/ApiHandlerUtils";
import type { NextApiRequest, NextApiResponse } from "next";

// GET /api/bus/stop-board?city=&stopName= — 站牌所有路線即時到站（輪詢）
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const params = new URLSearchParams();
  if (typeof req.query.city === "string") params.set("city", req.query.city);
  if (typeof req.query.stopName === "string")
    params.set("stopName", req.query.stopName);

  const targetUrl = `${process.env.THSR_TRAIN_TIME_BACKEND_ENDPOINT}/api/bus/stop-board?${params.toString()}`;
  return apiProxyHandler(req, res, targetUrl, "GET");
}
