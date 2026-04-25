import { ApiError, toApiError } from "@/models/problem-details";
import { useCallback, useEffect, useRef, useState } from "react";

/** 各鐵路通用的搜尋參數契約 */
export interface TrainSearchParams {
  startStationId: string;
  endStationId: string;
  date: string;
  time: string;
}

/** 由呼叫端注入的取資料函式；必須支援 AbortSignal */
export type TrainFetcher<T> = (
  params: TrainSearchParams,
  signal: AbortSignal,
) => Promise<T>;

interface UseTrainSearchGenericResult<T> {
  data: T | null;
  error: ApiError | null;
  isLoading: boolean;
  /** 觸發搜尋；後一次呼叫會 abort 前一次仍在飛行的請求 */
  search: (params: TrainSearchParams) => Promise<void>;
}

/**
 * 共用的搜尋 hook，原本三份 useTrSearch / useThsrSearch / useTymcSearch
 * 重複的 useState + try/catch + setState 邏輯抽出來。
 *
 * 特性：
 * - AbortController 取消上一次仍在飛行的請求，避免 race condition 後到先覆寫
 * - 元件卸載自動 abort，杜絕「setState on unmounted」警告
 * - 錯誤一律經 toApiError() 收斂為 ApiError，由呼叫端依 code 走 i18n
 */
const useTrainSearchGeneric = <T>(
  fetcher: TrainFetcher<T>,
): UseTrainSearchGenericResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // 卸載時取消所有飛行中請求
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const search = useCallback(
    async (params: TrainSearchParams) => {
      // 取消上一次仍在飛行的請求；新一次的優先級永遠較高
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsLoading(true);
      setError(null);

      try {
        const result = await fetcher(params, controller.signal);
        // 已被新查詢取代就放棄這份結果
        if (controller.signal.aborted) return;
        setData(result);
      } catch (err) {
        // 主動取消的請求不算錯誤
        if (
          controller.signal.aborted ||
          (err as Error)?.name === "AbortError"
        ) {
          return;
        }
        setError(toApiError(err));
        setData(null);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    },
    [fetcher],
  );

  return { data, error, isLoading, search };
};

export default useTrainSearchGeneric;
