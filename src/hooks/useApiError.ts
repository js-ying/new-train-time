import { ApiError, ProblemCode } from "@/models/problem-details";
import { useMemo } from "react";

/** 錯誤呈現的方式（搭配 DataState / Dialog / 全頁 fallback） */
export type ApiErrorKind = "inline" | "modal" | "fullpage";

export interface ApiErrorView {
  /** 呈現方式；無錯誤時為 null */
  kind: ApiErrorKind | null;
  /** 對應 i18n key (`errors.${code}`)；無錯誤時為空字串 */
  messageKey: string;
  /** 原始 ApiError，呼叫端如需 status / detail 自行存取 */
  error: ApiError | null;
}

/**
 * 各 ProblemCode 對應的 UI 行為：
 * - inline：搜尋結果區紅色 Alert（占位顯示），多數 API 錯誤都走這條
 * - modal：使用者必須處理（如 401 重新登入）
 * - fullpage：整頁 fallback（離線、致命錯誤）
 */
const CODE_TO_KIND: Record<ProblemCode, ApiErrorKind> = {
  INVALID_INPUT: "inline",
  DATE_OUT_OF_RANGE: "inline",
  UNAUTHORIZED: "modal",
  RATE_LIMITED: "inline",
  TDX_UPSTREAM_ERROR: "inline",
  BFF_UPSTREAM_ERROR: "inline",
  DB_UNAVAILABLE: "inline",
  INTERNAL_ERROR: "inline",
  NETWORK_OFFLINE: "fullpage",
  UNKNOWN: "inline",
};

/**
 * 把 ApiError 收斂為 UI 可直接消費的視圖物件。
 * 元件層只需要看 `kind` 決定顯示位置、`messageKey` 取 i18n。
 */
const useApiError = (error: ApiError | null): ApiErrorView => {
  return useMemo(() => {
    if (!error) {
      return { kind: null, messageKey: "", error: null };
    }

    const kind = CODE_TO_KIND[error.code] ?? "inline";
    return {
      kind,
      messageKey: `errors.${error.code}`,
      error,
    };
  }, [error]);
};

export default useApiError;
