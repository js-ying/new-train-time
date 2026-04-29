import { loadFirebaseAuth } from "@/configs/firebase";
import { ApiError, ProblemDetails, toApiError } from "@/models/problem-details";
import type { User } from "firebase/auth";

/**
 * User API 專用呼叫器：自動帶上 Firebase ID Token，並把後端 Problem Details 轉成 ApiError。
 * 呼叫端拿到 ApiError 後可用 `isAuthError(err)` 判斷是否要觸發強制登出。
 *
 * 為何不擴充 fetchData：fetchData 是泛用層不該知道 firebase；
 * user API 與 train API 的差異就在「需要 token」這件事，獨立一支更清楚。
 */
export async function callUserApi<T = unknown>(options: {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  /** 已知的 firebase user，省一次 currentUser 查詢；未提供則用 auth.currentUser */
  user?: User | null;
}): Promise<T> {
  // 已知 user 直接帶入；未帶則動態取 auth instance（會延後載入 firebase/auth chunk）
  let currentUser: User | null | undefined = options.user;
  if (currentUser === undefined) {
    const { auth } = await loadFirebaseAuth();
    currentUser = auth.currentUser;
  }
  if (!currentUser) {
    // 呼叫端應在登入後才呼叫；防呆用 UNAUTHORIZED 統一處理
    throw new ApiError("UNAUTHORIZED", 401);
  }

  const token = await currentUser.getIdToken();

  let response: Response;
  try {
    response = await fetch(options.url, {
      method: options.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: options.method !== "GET" ? JSON.stringify(options.body ?? {}) : null,
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
}
