import { apiProxyHandler } from "@/utils/ApiHandlerUtils";
import type { NextApiRequest, NextApiResponse } from "next";

// GET /api/bus/route/{routeUid}/meta?sub=1822A — 路線識別資訊（記憶體索引，不打 TDX）
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const routeUid = req.query.routeUid as string;
  const params = new URLSearchParams();
  if (typeof req.query.sub === "string") params.set("sub", req.query.sub);

  const targetUrl = `${process.env.THSR_TRAIN_TIME_BACKEND_ENDPOINT}/api/bus/route/${encodeURIComponent(routeUid)}/meta?${params.toString()}`;
  return apiProxyHandler(req, res, targetUrl, "GET");
}
