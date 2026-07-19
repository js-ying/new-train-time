import { JsyBusRouteInfo } from "@/models/jsy-bus-info";
import { ApiError, toApiError } from "@/models/problem-details";
import { getBusRouteInfo } from "@/services/busService";
import { useEffect, useRef, useState } from "react";
import { BusRouteSelection } from "./useBusRouteArrivals";

interface UseBusRouteInfoResult {
  info: JsyBusRouteInfo | null;
  isLoading: boolean;
  error: ApiError | null;
}

/**
 * 路線詳細資訊 hook（業者/票價/路線圖/定期時刻表）。
 * 選定路線即抓一次（長 TTL cache）：供「查看路線圖」外連與詳細資訊 modal 共用，換路線重抓。
 */
export const useBusRouteInfo = (
  selection: BusRouteSelection | null,
): UseBusRouteInfoResult => {
  const [info, setInfo] = useState<JsyBusRouteInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    abortRef.current?.abort();
    if (!selection) {
      setInfo(null);
      setError(null);
      setIsLoading(false);
      return;
    }
    const controller = new AbortController();
    abortRef.current = controller;
    setIsLoading(true);
    setError(null);
    setInfo(null);

    getBusRouteInfo(
      selection.routeUid,
      selection.source,
      selection.city,
      controller.signal,
    )
      .then((r) => {
        if (!controller.signal.aborted) setInfo(r);
      })
      .catch((err) => {
        if (controller.signal.aborted || (err as Error)?.name === "AbortError") {
          return;
        }
        setError(toApiError(err));
        setInfo(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection?.routeUid, selection?.source, selection?.city]);

  return { info, isLoading, error };
};

export default useBusRouteInfo;
