import { createHash } from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";

/** session token 本體（HttpOnly）；`__Host-` 前綴強制 Secure、Path=/、不可帶 Domain */
export const SESSION_COOKIE = "__Host-jsy_sid";
/** 前端判斷「可能已登入」與「是否換了帳號」用的提示 cookie（值為 uid 雜湊），不具任何權限 */
export const SESSION_HINT_COOKIE = "jsy_auth";
/** 轉送給後端的 session header */
export const SESSION_HEADER = "x-jsy-session";
/** 後端回傳續期 token 的 header */
export const SESSION_RENEW_HEADER = "x-jsy-session-renew";

/** 從 request 讀 session token */
export const readSessionCookie = (req: NextApiRequest): string | undefined =>
  req.cookies[SESSION_COOKIE] || undefined;

/** 附加 Set-Cookie（不覆蓋同一回應已設定的其他 cookie） */
const appendSetCookie = (res: NextApiResponse, cookies: string[]) => {
  const prev = res.getHeader("Set-Cookie");
  const list = prev === undefined ? [] : Array.isArray(prev) ? prev : [String(prev)];
  res.setHeader("Set-Cookie", [...list, ...cookies]);
};

/** 讀 JWT payload 的剩餘秒數與提示值（uid 雜湊）；解析失敗回 null */
const readTokenMeta = (
  token: string,
): { maxAge: number; hint: string } | null => {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64url").toString("utf8"),
    );
    const maxAge = Math.floor(payload.exp - Date.now() / 1000);
    if (!Number.isFinite(maxAge) || maxAge <= 0) return null;
    if (typeof payload.sub !== "string" || !payload.sub) return null;
    const hint = createHash("sha256").update(payload.sub).digest("hex").slice(0, 12);
    return { maxAge, hint };
  } catch {
    return null;
  }
};

/** 寫入 session 與提示 cookie，效期跟隨 token 的 exp；並禁止任何快取留存此回應 */
export const setSessionCookies = (res: NextApiResponse, token: string): boolean => {
  const meta = readTokenMeta(token);
  if (meta === null) return false;
  const attrs = `Path=/; Max-Age=${meta.maxAge}; Secure; SameSite=Lax`;
  appendSetCookie(res, [
    `${SESSION_COOKIE}=${token}; ${attrs}; HttpOnly`,
    `${SESSION_HINT_COOKIE}=${meta.hint}; ${attrs}`,
  ]);
  res.setHeader("Cache-Control", "private, no-store");
  return true;
};

/** 清除 session 與提示 cookie */
export const clearSessionCookies = (res: NextApiResponse) => {
  const attrs = "Path=/; Max-Age=0; Secure; SameSite=Lax";
  appendSetCookie(res, [
    `${SESSION_COOKIE}=; ${attrs}; HttpOnly`,
    `${SESSION_HINT_COOKIE}=; ${attrs}`,
  ]);
  res.setHeader("Cache-Control", "private, no-store");
};

/** 取 header 單一值 */
const headerValue = (req: NextApiRequest, name: string): string | undefined => {
  const v = req.headers[name];
  return Array.isArray(v) ? v[0] : v;
};

/**
 * 是否為本站發出的請求（CSRF 檢查）。
 * 優先看 Sec-Fetch-Site；不支援的舊瀏覽器退回比對 Origin 與 Host。
 * 兩者皆無時放行：瀏覽器的跨站請求必定至少帶其中一個。
 */
export const isSameOriginRequest = (req: NextApiRequest): boolean => {
  const site = headerValue(req, "sec-fetch-site");
  if (site) return site === "same-origin" || site === "none";
  const origin = headerValue(req, "origin");
  if (!origin) return true;
  try {
    const originHost = new URL(origin).host;
    return [headerValue(req, "x-forwarded-host"), headerValue(req, "host")].some(
      (host) => host === originHost,
    );
  } catch {
    return false;
  }
};
