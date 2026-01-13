import { apiProxyHandler } from "@/utils/ApiHandlerUtils";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const targetUrl = `${process.env.TRAIN_TIME_BACKEND_ENDPOINT}/api/getTrainTimeTable`;
  return apiProxyHandler(req, res, targetUrl);
}
