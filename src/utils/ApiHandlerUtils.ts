import { NextApiRequest, NextApiResponse } from "next";

/**
 * 通用的 API Proxy 處理器
 * 成功：原封不動轉發後端回應；
 * 失敗：
 *  - 後端回 Problem Details (RFC 9457)：直接轉發
 *  - fetch 本身失敗（後端 Express 不可達）：回 502 BFF_UPSTREAM_ERROR
 *    (注意與 TDX_UPSTREAM_ERROR 區分：後者是後端 Express → TDX 的失敗)
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
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-forwarded-for": clientIp || "",
    };

    if (req.headers.authorization) {
      headers["Authorization"] = req.headers.authorization as string;
    }

    const response = await fetch(targetUrl, {
      method,
      headers,
      body: method !== "GET" ? JSON.stringify(req.body) : null,
    });

    const contentType = response.headers.get("content-type") ?? "";
    const isJson = contentType.includes("json");
    const payload = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      // 非 2xx：若後端已是 Problem Details 則直接轉發，否則包一層。
      if (
        isJson &&
        typeof payload === "object" &&
        payload !== null &&
        "code" in payload
      ) {
        return res.status(response.status).json(payload);
      }
      return res.status(response.status).json({
        type: "https://traintime.jsy.tw/problems/internal_error",
        title: "INTERNAL_ERROR",
        status: response.status,
        code: "INTERNAL_ERROR",
        detail: typeof payload === "string" ? payload : undefined,
        instance: req.url,
      });
    }

    return res.status(200).json(payload);
  } catch (error: any) {
    console.error(`API Proxy Error [${targetUrl}]:`, error);
    // 後端 Express 不可達：502 + BFF_UPSTREAM_ERROR
    return res.status(502).json({
      type: "https://traintime.jsy.tw/problems/bff_upstream_error",
      title: "BFF_UPSTREAM_ERROR",
      status: 502,
      code: "BFF_UPSTREAM_ERROR",
      detail: error?.message,
      instance: req.url,
    });
  }
};
