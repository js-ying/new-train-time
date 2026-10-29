import { clientForwardHeaders, problemDetails } from "@/utils/ApiHandlerUtils";
import {
  clearSessionCookies,
  isSameOriginRequest,
  setSessionCookies,
} from "@/utils/sessionCookie";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * 會員 session：POST 以 Firebase ID token 換發並寫入 cookie，DELETE 清除 cookie。
 * token 只寫進 HttpOnly cookie，不回給前端 JS。
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  res.setHeader("Cache-Control", "private, no-store");

  if (!isSameOriginRequest(req)) {
    return res.status(403).json(problemDetails("FORBIDDEN", 403, req.url));
  }

  if (req.method === "DELETE") {
    clearSessionCookies(res);
    return res.status(200).json({ ok: true });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, DELETE");
    return res.status(405).json(problemDetails("INVALID_INPUT", 405, req.url));
  }

  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).json(problemDetails("UNAUTHORIZED", 401, req.url));
  }
  const source = req.body?.source === "migrate" ? "migrate" : "login";

  try {
    const response = await fetch(
      `${process.env.THSR_TRAIN_TIME_BACKEND_ENDPOINT}/api/session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorization,
          ...clientForwardHeaders(req),
        },
        body: JSON.stringify({ source }),
      },
    );
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      // 502 / 504 改回 503，避免 CF 吃掉 body（同 apiProxyHandler）
      const status =
        response.status === 502 || response.status === 504
          ? 503
          : response.status;
      if (payload && typeof payload === "object" && "code" in payload) {
        return res.status(status).json(payload);
      }
      return res
        .status(status)
        .json(problemDetails("INTERNAL_ERROR", status, req.url));
    }

    if (typeof payload?.token !== "string" || !setSessionCookies(res, payload.token)) {
      return res.status(500).json(problemDetails("INTERNAL_ERROR", 500, req.url));
    }
    return res.status(200).json({ ok: true });
  } catch (error: any) {
    console.error("Session Proxy Error:", error);
    return res
      .status(503)
      .json(problemDetails("BFF_UPSTREAM_ERROR", 503, req.url, error?.message));
  }
}
