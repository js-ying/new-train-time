import { JsyTrStationTimetable } from "@/models/jsy-tr-info";
import { ApiError, toApiError } from "@/models/problem-details";
import { getJsyTrStationTimetable } from "@/services/trService";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseTrStationTimetableResult {
  data: JsyTrStationTimetable | null;
  error: ApiError | null;
  isLoading: boolean;
  /** 查指定車站當日時刻表；後一次呼叫會 abort 前一次仍在飛行的請求 */
  fetchStation: (stationId: string) => Promise<void>;
  /** 清空資料回到初始（abort 飛行中請求、清 data/error/loading） */
  reset: () => void;
}

/**
 * 單站時刻表資料 hook。
 * - 以 SSR initialData 水合，避免首屏重抓（爬蟲拿到的時刻表即為畫面內容）。
 * - 換站時 client fetch；AbortController 取消上一筆飛行中請求、卸載自動取消。
 * - SSR 帶站但取數失敗（initialData 為 null）→ 首載時 client 補抓。
 */
export const useTrStationTimetable = (
  initialStationId: string | null,
  initialData: JsyTrStationTimetable | null,
): UseTrStationTimetableResult => {
  const [data, setData] = useState<JsyTrStationTimetable | null>(initialData);
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const fetchStation = useCallback(async (stationId: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    setError(null);

    try {
      const result = await getJsyTrStationTimetable(
        stationId,
        undefined,
        controller.signal,
      );
      if (controller.signal.aborted) return;
      setData(result);
    } catch (err) {
      if (controller.signal.aborted || (err as Error)?.name === "AbortError") {
        return;
      }
      setError(toApiError(err));
      setData(null);
    } finally {
      if (!controller.signal.aborted) setIsLoading(false);
    }
  }, []);

  // 清空資料回到初始（abort 飛行中請求、清 data/error/loading）
  const reset = useCallback(() => {
    abortRef.current?.abort();
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  // SSR 帶站但無資料（後端 SSR 取數失敗）→ 首載補抓一次
  useEffect(() => {
    if (initialStationId && !initialData) {
      fetchStation(initialStationId);
    }
    // 僅首載執行一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, error, isLoading, fetchStation, reset };
};

export default useTrStationTimetable;
