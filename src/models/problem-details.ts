/**
 * 前端 Problem Details 契約型別，對應後端 RFC 9457 回傳格式。
 * 後端只傳 error code，使用者可讀文案由前端依 code 查 i18n (`errors.${code}`)。
 */

export type ProblemCode =
  | "INVALID_INPUT"
  | "DATE_OUT_OF_RANGE"
  | "UNAUTHORIZED"
  | "RATE_LIMITED"
  /** 後端 Express → TDX 的 upstream 失敗 */
  | "TDX_UPSTREAM_ERROR"
  /** Next.js BFF → 後端 Express 的 upstream 失敗 (後端不可達) */
  | "BFF_UPSTREAM_ERROR"
  /** 後端 DB 連線 / 認證失敗 (503)；屬基礎設施暫時異常，可 retry */
  | "DB_UNAVAILABLE"
  | "INTERNAL_ERROR"
  | "NETWORK_OFFLINE"
  | "UNKNOWN";

export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  code: ProblemCode;
  detail?: string;
  instance?: string;
  [ext: string]: unknown;
}

/**
 * 前端統一的 API 例外：fetchData 捕捉到錯誤時拋出。
 * 呼叫端可以用 `error.code` 對應 i18n key。
 */
export class ApiError extends Error {
  public readonly code: ProblemCode;
  public readonly status: number;
  public readonly detail?: string;
  public readonly extras?: Record<string, unknown>;

  constructor(
    code: ProblemCode,
    status: number,
    detail?: string,
    extras?: Record<string, unknown>,
  ) {
    super(code);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.detail = detail;
    this.extras = extras;
  }
}

/**
 * 將未知錯誤物件歸類為 ProblemCode。
 * 離線 / TypeError 視為 NETWORK_OFFLINE；其他一律 UNKNOWN。
 */
export const toApiError = (err: unknown): ApiError => {
  if (err instanceof ApiError) return err;

  if (typeof err === "object" && err !== null) {
    const maybeProblem = err as Partial<ProblemDetails>;
    if (typeof maybeProblem.code === "string" && typeof maybeProblem.status === "number") {
      return new ApiError(
        maybeProblem.code as ProblemCode,
        maybeProblem.status,
        maybeProblem.detail,
      );
    }
  }

  const isNetworkError =
    (typeof err === "object" && err !== null && (err as Error).name === "TypeError") ||
    (typeof navigator !== "undefined" && navigator?.onLine === false);

  if (isNetworkError) {
    return new ApiError("NETWORK_OFFLINE", 0);
  }

  return new ApiError("UNKNOWN", 0);
};
