import { apiProxyHandler } from "@/utils/ApiHandlerUtils";
import type { NextApiRequest, NextApiResponse } from "next";

// GET /api/bus/route/{routeUid}/arrivals?source=city&city=Taipei — 雙向即時看板（輪詢）
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const routeUid = req.query.routeUid as string;
  const params = new URLSearchParams();
  if (typeof req.query.source === "string")
    params.set("source", req.query.source);
  if (typeof req.query.city === "string") params.set("city", req.query.city);

  const targetUrl = `${process.env.THSR_TRAIN_TIME_BACKEND_ENDPOINT}/api/bus/route/${encodeURIComponent(routeUid)}/arrivals?${params.toString()}`;
  return apiProxyHandler(req, res, targetUrl, "GET");
}
