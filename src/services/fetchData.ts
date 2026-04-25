import { ApiError, ProblemDetails, toApiError } from "@/models/problem-details";

/**
 * 前端統一的 API 呼叫器。
 * 成功：回傳 JSON；
 * 失敗：統一拋出 ApiError（具 code / status），讓呼叫端依 code 走 i18n。
 *
 * 支援 AbortSignal：呼叫端傳入 signal 即可在重複查詢／元件卸載時取消請求，
 * 取消造成的 DOMException 會被原樣拋出（name === "AbortError"），交呼叫端忽略。
 */
const fetchData = async <T = unknown>(
  url = "",
  data: unknown = {},
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "POST",
  signal?: AbortSignal,
): Promise<T> => {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: method !== "GET" ? JSON.stringify(data) : null,
    signal,
  };

  let response: Response;
  try {
    response = await fetch(url, options);
  } catch (error) {
    // 取消請求：原樣拋出，呼叫端決定怎麼處理
    if ((error as Error)?.name === "AbortError") throw error;
    // fetch 本身失敗（斷網、CORS 等）
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

export default fetchData;
