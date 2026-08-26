import { apiProxyHandler } from "@/utils/ApiHandlerUtils";
import type { NextApiRequest, NextApiResponse } from "next";

// GET /api/bus/routes?q=182&limit=30&lang=en — 模糊搜路線候選，轉發後端記憶體索引查詢
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const params = new URLSearchParams();
  if (typeof req.query.q === "string") params.set("q", req.query.q);
  if (typeof req.query.limit === "string") params.set("limit", req.query.limit);
  if (req.query.lang === "en") params.set("lang", "en");

  const targetUrl = `${process.env.THSR_TRAIN_TIME_BACKEND_ENDPOINT}/api/bus/routes?${params.toString()}`;
  return apiProxyHandler(req, res, targetUrl, "GET");
}
