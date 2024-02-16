import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { SearchAreaUpdateContext } from "../contexts/SearchAreaContext";
import fetchData from "../services/fetchData";
import { JsyThsrTrainTimeTable } from "../types/thsr-train-time-table";
import {
  JsyTrTrainTimeTable,
  TrDailyTrainTimetable,
} from "../types/tr-train-time-table";
import usePage from "./usePageHook";
import useParamsValidation, { AlertOptions } from "./useParamsValidationHook";
import useSearchAreaParams from "./useSearchAreaParamsHook";

interface UseTrainSearchResult {
  isLoading: boolean;
  isApiHealth: boolean;
  alertOptions: AlertOptions;
  trainTimeTable: JsyTrTrainTimeTable[];
  thsrTrainTimeTable: JsyThsrTrainTimeTable;
}

const useTrainSearch = (): UseTrainSearchResult => {
  const router = useRouter();
  const { isTr, isThsr } = usePage();
  const setParams = useContext(SearchAreaUpdateContext);

  const { isParamsValid, alertOptions } = useParamsValidation();

  const [isLoading, setIsLoading] = useState(false);
  const [isApiHealth, setIsApiHealth] = useState(true);

  const [trainTimeTable, setTrainTimeTable] =
    useState<JsyTrTrainTimeTable[]>(null);
  const [thsrTrainTimeTable, setThsrTrainTimeTable] =
    useState<JsyThsrTrainTimeTable>(null);

  // 初始化搜尋區域參數 from URL
  const { urlSearchAreaParams } = useSearchAreaParams();

  // 取得時刻表
  const getTrainTimeTable = async (
    startStationId: string,
    endStationId: string,
    date: string,
    time: string,
  ) => {
    console.log("getTrainTimeTable...");
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
          setTrainTimeTable([...data.TrainTimetables]);
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
        const result = await fetchData("/api/getThsrTrainTimeTable", {
          startStationId,
          endStationId,
          date,
          time,
        });

        const data = result;
        if (data) {
          setThsrTrainTimeTable({ ...data });
        } else {
          setThsrTrainTimeTable({ ...thsrTrainTimeTable, timeTable: [] });
        }
        setIsApiHealth(true);
      } catch (error) {
        setThsrTrainTimeTable({ ...thsrTrainTimeTable, timeTable: [] });

        setIsApiHealth(false);

        alertOptions.setAlertMsg(error);
      }
    }

    setIsLoading(false);
  };

  useEffect(() => {
    // 導頁永遠都是 true，直接進入/重新整理頁面一開始是 false，需等待變 true
    if (router.isReady) {
      const updatedParams = urlSearchAreaParams;
      setParams(updatedParams);

      if (
        isParamsValid(
          updatedParams.startStationId,
          updatedParams.endStationId,
          updatedParams.date,
        )
      ) {
        getTrainTimeTable(
          updatedParams.startStationId,
          updatedParams.endStationId,
          updatedParams.date,
          updatedParams.time,
        );
      }
    }
  }, [
    router.isReady,
    router.query.s,
    router.query.e,
    router.query.d,
    router.query.t,
  ]);

  return {
    isLoading,
    isApiHealth,
    alertOptions,
    trainTimeTable,
    thsrTrainTimeTable,
  };
};

export default useTrainSearch;
