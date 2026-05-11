import {
  SearchAreaContext,
  SearchAreaUpdateContext,
} from "@/contexts/SearchAreaContext";
import { JsyThsrInfo } from "@/models/jsy-thsr-info";
import { JsyTrInfo, JsyTrTransferInfo } from "@/models/jsy-tr-info";
import { JsyTymcInfo } from "@/models/jsy-tymc-info";
import { ApiError } from "@/models/problem-details";
import { getThsrInfo } from "@/services/thsrService";
import { getJsyTrInfo, getJsyTrTransferInfo } from "@/services/trService";
import { getTymcInfo } from "@/services/tymcService";
import DateUtils from "@/utils/DateUtils";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useMemo } from "react";
import usePage from "../usePage";
import useParamsValidation, { ValidationAlert } from "../useParamsValidation";
import useSearchAreaParams from "../useSearchAreaParams";
import useSearchMode from "./useSearchMode";
import useTrainSearchGeneric, {
  TrainFetcher,
  TrainSearchParams,
} from "./useTrainSearchGeneric";

interface UseTrainSearchResult {
  isLoading: boolean;
  /** 當前頁面對應鐵路的 API 錯誤；無錯誤為 null */
  apiError: ApiError | null;
  /** 參數驗證 alert 控制；與 API 錯誤完全分離（API 錯誤走 apiError） */
  validationAlert: ValidationAlert;
  jsyTrInfo: JsyTrInfo | null;
  jsyTrTransferInfo: JsyTrTransferInfo | null;
  jsyThsrInfo: JsyThsrInfo | null;
  jsyTymcInfo: JsyTymcInfo | null;
}

// 各鐵路的 fetcher：把 service 函式包成符合 TrainFetcher<T> 簽章
const trFetcher: TrainFetcher<JsyTrInfo> = (
  { startStationId, endStationId, date, time }: TrainSearchParams,
  signal,
) => getJsyTrInfo(startStationId, endStationId, date, time, signal);

const trTransferFetcher: TrainFetcher<JsyTrTransferInfo> = (
  { startStationId, endStationId, date, time }: TrainSearchParams,
  signal,
) => getJsyTrTransferInfo(startStationId, endStationId, date, time, signal);

const thsrFetcher: TrainFetcher<JsyThsrInfo> = (
  { startStationId, endStationId, date, time }: TrainSearchParams,
  signal,
) => getThsrInfo(startStationId, endStationId, date, time, signal);

const tymcFetcher: TrainFetcher<JsyTymcInfo> = (
  { startStationId, endStationId, date, time }: TrainSearchParams,
  signal,
) => getTymcInfo(startStationId, endStationId, date, time, signal);

const useTrainSearch = (): UseTrainSearchResult => {
  const router = useRouter();
  const { isTr, isThsr, isTymc } = usePage();
  const { isTransfer } = useSearchMode();
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);

  const { isParamsValid, validationAlert } = useParamsValidation();

  // 三鐵路各起一個泛型搜尋 hook 實例；共用同一份重複邏輯，介面保持分離
  const tr = useTrainSearchGeneric<JsyTrInfo>(trFetcher);
  const trTransfer =
    useTrainSearchGeneric<JsyTrTransferInfo>(trTransferFetcher);
  const thsr = useTrainSearchGeneric<JsyThsrInfo>(thsrFetcher);
  const tymc = useTrainSearchGeneric<JsyTymcInfo>(tymcFetcher);

  const { urlSearchAreaParams } = useSearchAreaParams();

  // 取得時刻表 (統一協調調度)；只觸發當前頁面對應的鐵路
  // TR 額外依 mode 切到 transfer endpoint；THSR/TYMC 暫無 transfer
  const getTrainTimeTable = useCallback(
    async (
      startStationId: string,
      endStationId: string,
      date: string,
      time: string,
    ) => {
      const params: TrainSearchParams = {
        startStationId,
        endStationId,
        date,
        time,
      };
      if (isTr) {
        if (isTransfer) await trTransfer.search(params);
        else await tr.search(params);
      }
      if (isThsr) await thsr.search(params);
      if (isTymc) await tymc.search(params);
    },
    [
      isTr,
      isThsr,
      isTymc,
      isTransfer,
      tr.search,
      trTransfer.search,
      thsr.search,
      tymc.search,
    ],
  );

  // 監聽 [直接進入/重新整理頁面/搜尋按鈕 router.push] 變化同步 SearchAreaParams
  useEffect(() => {
    if (!router.isReady) return;

    const updatedParams = urlSearchAreaParams;

    setParams((prevParams) => ({
      ...prevParams,
      ...updatedParams,
      uuid: prevParams.uuid,
    }));
  }, [
    router.isReady,
    router.query.s,
    router.query.e,
    router.query.d,
    router.query.t,
  ]);

  // 監聽參數變化觸發 API
  // 把 router.query.m 也納入依賴：mode 切換時要重新 fetch（即使其他參數沒變）
  useEffect(() => {
    if (!router.isReady) return;

    const { startStationId, endStationId, date, time } = urlSearchAreaParams;

    const { isValid, isDateInValid } = isParamsValid(
      startStationId,
      endStationId,
      date,
      time,
    );

    if (!isValid) {
      // 檢核失敗，且非日期錯誤，則不予查詢
      if (!isDateInValid) return;

      const currentDate = DateUtils.getCurrentDate();
      const currentTime = DateUtils.getCurrentTime();

      setParams((prev) => ({
        ...prev,
        date: currentDate,
        time: currentTime,
      }));

      getTrainTimeTable(startStationId, endStationId, currentDate, currentTime);
      return;
    }

    getTrainTimeTable(startStationId, endStationId, date, time);
  }, [
    router.isReady,
    router.query.s,
    router.query.e,
    router.query.d,
    router.query.t,
    router.query.m,
    params?.uuid,
  ]);

  const activeError = useMemo<ApiError | null>(() => {
    if (isTr) return isTransfer ? trTransfer.error : tr.error;
    if (isThsr) return thsr.error;
    if (isTymc) return tymc.error;
    return null;
  }, [
    isTr,
    isThsr,
    isTymc,
    isTransfer,
    tr.error,
    trTransfer.error,
    thsr.error,
    tymc.error,
  ]);

  return {
    isLoading:
      tr.isLoading ||
      trTransfer.isLoading ||
      thsr.isLoading ||
      tymc.isLoading,
    apiError: activeError,
    validationAlert,
    jsyTrInfo: tr.data,
    jsyTrTransferInfo: trTransfer.data,
    jsyThsrInfo: thsr.data,
    jsyTymcInfo: tymc.data,
  };
};

export default useTrainSearch;
