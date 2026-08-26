import { JsyBusRoute } from "@/models/jsy-bus-info";
import { ApiError, toApiError } from "@/models/problem-details";
import { searchBusRoutes } from "@/services/busService";
import { useTranslation } from "next-i18next";
import { useCallback, useEffect, useRef, useState } from "react";

/** 路線號輸入防抖（毫秒）：避免每次鍵入都打後端。 */
const SEARCH_DEBOUNCE_MS = 300;
/** 候選數量上限（後端會 clamp 至 50，前端取較精簡值）。 */
const SEARCH_LIMIT = 30;
/** 查詢字串長度上限，對齊後端 MAX_SEARCH_Q_LEN；超過必被擋成 400，不送。 */
export const BUS_ROUTE_QUERY_MAX_LEN = 50;

interface UseBusRouteSearchResult {
  suggestions: JsyBusRoute[];
  isLoading: boolean;
  error: ApiError | null;
  /** 設定查詢字串；內部防抖 + 取消前一筆飛行請求後才打後端 */
  setQuery: (q: string) => void;
}

/**
 * 公車路線模糊搜 hook。
 * - 鍵入防抖 300ms，後一次查詢會 abort 前一次仍在飛行的請求。
 * - 空字串或超過長度上限清空候選、不打後端（後端 q 必填且限長）。
 */
export const useBusRouteSearch = (): UseBusRouteSearchResult => {
  const { i18n } = useTranslation();
  const [suggestions, setSuggestions] = useState<JsyBusRoute[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // 卸載時清防抖計時器並取消飛行請求
  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    },
    [],
  );

  const lang = i18n.language;
  const runSearch = useCallback(
    async (q: string) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsLoading(true);
      setError(null);

      try {
        const result = await searchBusRoutes(
          q,
          SEARCH_LIMIT,
          controller.signal,
          lang,
        );
        if (controller.signal.aborted) return;
        setSuggestions(result);
      } catch (err) {
        if (
          controller.signal.aborted ||
          (err as Error)?.name === "AbortError"
        ) {
          return;
        }
        setError(toApiError(err));
        setSuggestions([]);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    },
    [lang],
  );

  const setQuery = useCallback(
    (q: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      const trimmed = q.trim();
      // 空字串或超長：清空候選、取消飛行請求，不打後端（後端 q 必填且有長度上限）
      if (!trimmed || trimmed.length > BUS_ROUTE_QUERY_MAX_LEN) {
        abortRef.current?.abort();
        setSuggestions([]);
        setError(null);
        setIsLoading(false);
        return;
      }
      debounceRef.current = setTimeout(() => {
        debounceRef.current = null;
        void runSearch(trimmed);
      }, SEARCH_DEBOUNCE_MS);
    },
    [runSearch],
  );

  return { suggestions, isLoading, error, setQuery };
};

export default useBusRouteSearch;
