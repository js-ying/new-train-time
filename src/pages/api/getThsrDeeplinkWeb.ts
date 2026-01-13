import { apiProxyHandler } from "@/utils/ApiHandlerUtils";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const targetUrl = `${process.env.THSR_TRAIN_TIME_BACKEND_ENDPOINT}/api/getThsrDeeplinkWeb`;
  return apiProxyHandler(req, res, targetUrl);
}
