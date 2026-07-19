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
  // sub：使用者選的子線名（如 1822A），後端據此篩骨幹；route 粒度不帶
  if (typeof req.query.sub === "string") params.set("sub", req.query.sub);
  // log=1：前端初次選定路線才帶，供後端 analytics 去重（輪詢/刷新不帶）
  if (req.query.log === "1") params.set("log", "1");

  const targetUrl = `${process.env.THSR_TRAIN_TIME_BACKEND_ENDPOINT}/api/bus/route/${encodeURIComponent(routeUid)}/arrivals?${params.toString()}`;
  return apiProxyHandler(req, res, targetUrl, "GET");
}
