import type { ProblemCode, ProblemDetails } from "@/models/problem-details";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * 組出轉發給後端的真實 client IP headers（cf-connecting-ip / x-forwarded-for）；
 * 無 CF 環境（如 dev）才會用到 XFF，避免 IP 塌成 localhost。
 */
export const clientIpForwardHeaders = (
  req: Pick<NextApiRequest, "headers" | "socket">,
): Record<string, string> => {
  const headers: Record<string, string> = {};
  const cfIp = req.headers["cf-connecting-ip"];
  if (typeof cfIp === "string" && cfIp) headers["cf-connecting-ip"] = cfIp;
  const xff =
    (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress;
  if (xff) headers["x-forwarded-for"] = xff;
  return headers;
};

const isJsonObject = (body: unknown): boolean =>
  typeof body === "object" && body !== null && !Array.isArray(body);

const PROBLEM_TYPE_BASE = "https://traintime.jsy.tw/problems/";

/** BFF 自行產生的 Problem Details (RFC 9457)，格式對齊後端：type 為 code 小寫。 */
const problemDetails = (
  code: ProblemCode,
  status: number,
  instance: string,
  detail?: string,
): ProblemDetails => ({
  type: `${PROBLEM_TYPE_BASE}${code.toLowerCase()}`,
  title: code,
  status,
  code,
  detail,
  instance,
});

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
  // 非 JSON 物件的 body 直接擋下不轉發：缺 Content-Type 時 Next 會把 body 解析成字串。
  // 前提：呼叫端一律經 fetchData / callUserApi，兩者 non-GET 都送 JSON.stringify(body ?? {})，
  // 故無 body 的 DELETE 也會是 {}；若日後新增直接用 fetch 的呼叫端，需一併帶 JSON body。
  if (method !== "GET" && !isJsonObject(req.body)) {
    return res.status(400).json(problemDetails("INVALID_INPUT", 400, req.url));
  }

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...clientIpForwardHeaders(req),
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
      // Cloudflare 會攔截 origin 回的 502 / 504，把整個 body 換成自家純文字頁，
      // 導致前端讀不到 Problem Details 的 code。故把這兩個 gateway 狀態碼改寫成 503
      // （CF 對 origin 503 原樣放行），內層 body（含 code）不動，前端便能依 code 顯示 i18n。
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
      return res
        .status(clientStatus)
        .json(
          problemDetails(
            "INTERNAL_ERROR",
            clientStatus,
            req.url,
            typeof payload === "string" ? payload : undefined,
          ),
        );
    }

    return res.status(200).json(payload);
  } catch (error: any) {
    console.error(`API Proxy Error [${targetUrl}]:`, error);
    // 後端 Express 不可達：本應是 502，但 CF 會吃掉 502 的 body（見上方說明），
    // 故對前端回 503 讓 body 中的 code 存活；語意仍為 BFF→Express 的 upstream 失敗。
    return res
      .status(503)
      .json(problemDetails("BFF_UPSTREAM_ERROR", 503, req.url, error?.message));
  }
};
