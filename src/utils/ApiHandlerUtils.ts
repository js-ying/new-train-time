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
      // Cloudflare 會攔截 origin 回的 502 / 504，把整個 body 換成自家 "error code: 5xx"
      // 純文字頁，導致前端 fetchData 讀不到 Problem Details 的 code、所有上游錯誤都塌成
      // INTERNAL_ERROR。BFF 即是 CF 的適配層：把這兩個會被吃掉 body 的 gateway 狀態碼
      // 改寫成 503（CF 對 origin 503 原樣放行），內層 Problem Details body（含 code）不動，
      // 前端便能依 code 正確顯示對應 i18n。後端維持回 502 以保留誠實的上游語意（log 用）。
      const clientStatus =
        response.status === 502 || response.status === 504
          ? 503
          : response.status;

      // 非 2xx：若後端已是 Problem Details 則直接轉發，否則包一層。
      if (
        isJson &&
        typeof payload === "object" &&
        payload !== null &&
        "code" in payload
      ) {
        return res.status(clientStatus).json(payload);
      }
      return res.status(clientStatus).json({
        type: "https://traintime.jsy.tw/problems/internal_error",
        title: "INTERNAL_ERROR",
        status: clientStatus,
        code: "INTERNAL_ERROR",
        detail: typeof payload === "string" ? payload : undefined,
        instance: req.url,
      });
    }

    return res.status(200).json(payload);
  } catch (error: any) {
    console.error(`API Proxy Error [${targetUrl}]:`, error);
    // 後端 Express 不可達：本應是 502，但 CF 會吃掉 502 的 body（見上方說明），
    // 故對前端回 503 讓 body 中的 code 存活；語意仍為 BFF→Express 的 upstream 失敗。
    return res.status(503).json({
      type: "https://traintime.jsy.tw/problems/bff_upstream_error",
      title: "BFF_UPSTREAM_ERROR",
      status: 503,
      code: "BFF_UPSTREAM_ERROR",
      detail: error?.message,
      instance: req.url,
    });
  }
};
