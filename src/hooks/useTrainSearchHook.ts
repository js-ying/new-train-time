import {
  SearchAreaContext,
  SearchAreaUpdateContext,
} from "@/contexts/SearchAreaContext";
import { JsyThsrInfo } from "@/models/jsy-thsr-info";
import { JsyTymcInfo } from "@/models/jsy-tymc-info";
import {
  JsyTrTrainTimeTable,
  TrDailyTrainTimetable,
} from "@/models/tr-train-time-table";
import fetchData from "@/services/fetchData";
import DateUtils from "@/utils/DateUtils";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import usePage from "./usePageHook";
import useParamsValidation, { AlertOptions } from "./useParamsValidationHook";
import useSearchAreaParams from "./useSearchAreaParamsHook";

interface UseTrainSearchResult {
  isLoading: boolean;
  isApiHealth: boolean;
  alertOptions: AlertOptions;
  trainTimeTable: JsyTrTrainTimeTable[];
  jsyThsrInfo: JsyThsrInfo;
  jsyTymcInfo: JsyTymcInfo;
}

const useTrainSearch = (): UseTrainSearchResult => {
  const router = useRouter();
  const { isTr, isThsr, isTymc } = usePage();
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);

  const { isParamsValid, alertOptions } = useParamsValidation();

  const [isLoading, setIsLoading] = useState(false);
  const [isApiHealth, setIsApiHealth] = useState(true);

  const [trainTimeTable, setTrainTimeTable] =
    useState<JsyTrTrainTimeTable[]>(null);
  const [jsyThsrInfo, setJsyThsrInfo] = useState<JsyThsrInfo>(null);
  const [jsyTymcInfo, setJsyTymcInfo] = useState<JsyTymcInfo>(null);

  // 初始化搜尋區域參數 from URL
  const { urlSearchAreaParams } = useSearchAreaParams();

  // 取得時刻表
  const getTrainTimeTable = async (
    startStationId: string,
    endStationId: string,
    date: string,
    time: string,
  ) => {
    setIsLoading(true);

    if (isTr) {
      try {
        const result = await fetchData("/api/getTrainTimeTable", {
          startStationId,
          endStationId,
          date,
          time,
        });

        const data: TrDailyTrainTimetable = result;
        if (data?.TrainTimetables?.length >= 0) {
          const jsyTrTrainTimeTables: JsyTrTrainTimeTable[] = [
            ...data.TrainTimetables,
          ];
          jsyTrTrainTimeTables.forEach(
            (table: JsyTrTrainTimeTable) =>
              (table["trainDate"] = data.TrainDate),
          );
          setTrainTimeTable(jsyTrTrainTimeTables);
        } else {
          setTrainTimeTable([]);
        }
        setIsApiHealth(true);
      } catch (error) {
        setTrainTimeTable([]);

        setIsApiHealth(false);

        alertOptions.setAlertMsg(error);
      }
    }

    if (isThsr) {
      try {
        const result = await fetchData("/api/getJsyThsrInfo", {
          startStationId,
          endStationId,
          date,
          time,
        });

        const data = result;
        if (data) {
          setJsyThsrInfo({ ...data });
        } else {
          setJsyThsrInfo({ ...jsyThsrInfo, timeTable: [] });
        }
        setIsApiHealth(true);
      } catch (error) {
        setJsyThsrInfo({ ...jsyThsrInfo, timeTable: [] });

        setIsApiHealth(false);

        alertOptions.setAlertMsg(error);
      }
    }

    if (isTymc) {
      try {
        const result = await fetchData("/api/getJsyTymcInfo", {
          startStationId,
          endStationId,
          date,
          time,
        });

        const data = result;
        if (data) {
          setJsyTymcInfo({ ...data });
        } else {
          setJsyTymcInfo({ ...jsyTymcInfo, timeTables: [] });
        }
        setIsApiHealth(true);
      } catch (error) {
        setJsyTymcInfo({ ...jsyTymcInfo, timeTables: [] });

        setIsApiHealth(false);

        alertOptions.setAlertMsg(error);
      }
    }

    setIsLoading(false);
  };

  // 監聽 [直接進入/重新整理頁面/搜尋按鈕 router.push] 變化同步 SearchAreaParams
  useEffect(() => {
    // 導頁永遠都是 true，直接進入/重新整理頁面一開始是 false，需等待變 true
    if (!router.isReady) return;

    const updatedParams = urlSearchAreaParams;

    setParams((prevParams) => ({
      ...prevParams,
      ...updatedParams,
      // 重要：保留當前的 uuid，避免同步原始 URL 參數時（uuid 為 ""）再次觸發搜尋 Effect
      uuid: prevParams.uuid,
    }));
  }, [
    router.isReady,
    router.query.s,
    router.query.e,
    router.query.d,
    router.query.t,
  ]);

  // 監聽 [直接進入/重新整理頁面/搜尋按鈕 router.push/uuid 變化] 變化觸發 API
  useEffect(() => {
    // 導頁永遠都是 true，直接進入/重新整理頁面一開始是 false，需等待變 true
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
        // 檢核失敗，且非日期錯誤，則不予查詢
        if (!isDateInValid) return;

        // 檢核失敗，且是日期錯誤，則更新日期時間為當前時間並查詢
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
    isLoading,
    isApiHealth,
    alertOptions,
    trainTimeTable,
    jsyThsrInfo,
    jsyTymcInfo,
  };
};

export default useTrainSearch;
