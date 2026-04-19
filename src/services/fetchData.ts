import { ApiError, ProblemDetails, toApiError } from "@/models/problem-details";

/**
 * 前端統一的 API 呼叫器。
 * 成功：回傳 JSON；
 * 失敗：統一拋出 ApiError（具 code / status），讓呼叫端依 code 走 i18n。
 */
const fetchData = async <T = unknown>(
  url = "",
  data: unknown = {},
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "POST",
): Promise<T> => {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: method !== "GET" ? JSON.stringify(data) : null,
  };

  let response: Response;
  try {
    response = await fetch(url, options);
  } catch (error) {
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
