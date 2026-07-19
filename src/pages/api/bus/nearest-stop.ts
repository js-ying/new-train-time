import { apiProxyHandler } from "@/utils/ApiHandlerUtils";
import type { NextApiRequest, NextApiResponse } from "next";

// GET /api/bus/nearest-stop?lat=&lon= — 定位解析最近站牌
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const params = new URLSearchParams();
  if (typeof req.query.lat === "string") params.set("lat", req.query.lat);
  if (typeof req.query.lon === "string") params.set("lon", req.query.lon);

  const targetUrl = `${process.env.THSR_TRAIN_TIME_BACKEND_ENDPOINT}/api/bus/nearest-stop?${params.toString()}`;
  return apiProxyHandler(req, res, targetUrl, "GET");
}
