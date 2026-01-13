import { NextApiRequest, NextApiResponse } from "next";

/**
 * 通用的 API Proxy 處理器
 * @param req NextApiRequest
 * @param res NextApiResponse
 * @param targetUrl 後端 API 的完整 URL
 * @param method HTTP 方法，預設為 POST
 */
export const apiProxyHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  targetUrl: string,
  method: string = "POST",
) => {
  const clientIp =
    (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress;

  try {
    const response = await fetch(targetUrl, {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": clientIp || "",
      },
      body: method !== "GET" ? JSON.stringify(req.body) : null,
    });

    const result = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(result);
    }

    return res.status(200).json(result);
  } catch (error: any) {
    console.error(`API Proxy Error [${targetUrl}]:`, error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error?.message || error,
    });
  }
};
