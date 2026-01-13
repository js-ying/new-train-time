import {
  SearchAreaContext,
  SearchAreaUpdateContext,
} from "@/contexts/SearchAreaContext";
import DateUtils from "@/utils/DateUtils";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import usePage from "../usePage";
import useParamsValidation, { AlertOptions } from "../useParamsValidation";
import useSearchAreaParams from "../useSearchAreaParams";
import { useThsrSearch } from "./useThsrSearch";
import { useTrSearch } from "./useTrSearch";
import { useTymcSearch } from "./useTymcSearch";

interface UseTrainSearchResult {
  isLoading: boolean;
  isApiHealth: boolean;
  alertOptions: AlertOptions;
  trainTimeTable: any[];
  jsyThsrInfo: any;
  jsyTymcInfo: any;
}

const useTrainSearch = (): UseTrainSearchResult => {
  const router = useRouter();
  const { isTr, isThsr, isTymc } = usePage();
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);

  const { isParamsValid, alertOptions } = useParamsValidation();

  // 子 Hook 初始化
  const {
    trainTimeTable,
    isLoading: isTrLoading,
    isApiHealth: isTrApiHealth,
    searchTr,
  } = useTrSearch(alertOptions);

  const {
    jsyThsrInfo,
    isLoading: isThsrLoading,
    isApiHealth: isThsrApiHealth,
    searchThsr,
  } = useThsrSearch(alertOptions);

  const {
    jsyTymcInfo,
    isLoading: isTymcLoading,
    isApiHealth: isTymcApiHealth,
    searchTymc,
  } = useTymcSearch(alertOptions);

  // 初始化搜尋區域參數 from URL
  const { urlSearchAreaParams } = useSearchAreaParams();

  // 取得時刻表 (統一協調調度)
  const getTrainTimeTable = async (
    startStationId: string,
    endStationId: string,
    date: string,
    time: string,
  ) => {
    if (isTr) await searchTr(startStationId, endStationId, date, time);
    if (isThsr) await searchThsr(startStationId, endStationId, date, time);
    if (isTymc) await searchTymc(startStationId, endStationId, date, time);
  };

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
  useEffect(() => {
    if (!router.isReady) return;

    const { startStationId, endStationId, date, time } = urlSearchAreaParams;

    if (startStationId && endStationId && date && time) {
      const { isValid, isDateInValid } = isParamsValid(
        startStationId,
        endStationId,
        date,
        time,
      );

      if (!isValid) {
        if (!isDateInValid) return;

        const currentDate = DateUtils.getCurrentDate();
        const currentTime = DateUtils.getCurrentTime();

        setParams((prev) => ({
          ...prev,
          date: currentDate,
          time: currentTime,
        }));

        getTrainTimeTable(
          startStationId,
          endStationId,
          currentDate,
          currentTime,
        );
        return;
      }

      getTrainTimeTable(startStationId, endStationId, date, time);
    }
  }, [
    router.isReady,
    router.query.s,
    router.query.e,
    router.query.d,
    router.query.t,
    params?.uuid,
  ]);

  return {
    isLoading: isTrLoading || isThsrLoading || isTymcLoading,
    isApiHealth: isTrApiHealth && isThsrApiHealth && isTymcApiHealth,
    alertOptions,
    trainTimeTable,
    jsyThsrInfo,
    jsyTymcInfo,
  };
};

export default useTrainSearch;
