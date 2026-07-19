import { apiProxyHandler } from "@/utils/ApiHandlerUtils";
import type { NextApiRequest, NextApiResponse } from "next";

// GET /api/bus/stop-board?stopUid= — 站牌所有路線即時到站（單錨；source/city/stopName 後端反查）
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const params = new URLSearchParams();
  if (typeof req.query.stopUid === "string")
    params.set("stopUid", req.query.stopUid);

  const targetUrl = `${process.env.THSR_TRAIN_TIME_BACKEND_ENDPOINT}/api/bus/stop-board?${params.toString()}`;
  return apiProxyHandler(req, res, targetUrl, "GET");
}
