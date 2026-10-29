import { ApiError, ProblemDetails, toApiError } from "@/models/problem-details";

/**
 * 讀登入提示 cookie（uid 雜湊）；無則回 null。
 * 只代表「可能已登入」與「是否換了帳號」，實際以 /me 為準。
 */
export const readSessionHint = (): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)jsy_auth=([^;]+)/);
  return match ? match[1] : null;
};

/** 送出請求並把非 2xx 的 Problem Details 轉成 ApiError */
const request = async <T>(
  url: string,
  init: RequestInit & { method: string },
): Promise<T> => {
  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      headers: { "Content-Type": "application/json", ...init.headers },
    });
  } catch (error) {
    throw toApiError(error);
  }

  const contentType = response.headers.get("content-type") ?? "";
  let body: unknown = null;
  if (contentType.includes("json")) {
    try {
      body = await response.json();
    } catch {
      body = null;
    }
  }

  if (!response.ok) {
    if (body && typeof body === "object" && "code" in (body as object)) {
      throw toApiError(body as ProblemDetails);
    }
    throw new ApiError("INTERNAL_ERROR", response.status);
  }

  return body as T;
};

/**
 * User API 專用呼叫器：身分由瀏覽器自動帶的 session cookie 決定，並把後端 Problem Details 轉成 ApiError。
 * 呼叫端拿到 ApiError 後可用 `isAuthError(err)` 判斷是否要觸發強制登出。
 */
export async function callUserApi<T = unknown>(options: {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  /** 可選的中止訊號；呼叫端可在同步被新操作取代時取消進行中的請求 */
  signal?: AbortSignal;
}): Promise<T> {
  return request<T>(options.url, {
    method: options.method,
    body: options.method !== "GET" ? JSON.stringify(options.body ?? {}) : null,
    signal: options.signal,
  });
}

/** 以 Firebase ID token 換發 session cookie；login＝使用者登入、migrate＝既有登入轉移 */
export const createSession = (idToken: string, source: "login" | "migrate") =>
  request<{ ok: true }>("/api/session", {
    method: "POST",
    headers: { Authorization: `Bearer ${idToken}` },
    body: JSON.stringify({ source }),
  });

/** 清除 session cookie；失敗不拋錯（登出流程不可因此中斷） */
export const deleteSession = async (): Promise<void> => {
  try {
    await request("/api/session", { method: "DELETE", body: "{}" });
  } catch (error) {
    console.error("清除 session 失敗", error);
  }
};
