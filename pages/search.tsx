import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTheme } from "next-themes";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect, useMemo, useState } from "react";
import CommonDialog from "../components/CommonDialog";
import Layout from "../components/Layout";
import Loading from "../components/Loading";
import SearchArea from "../components/search-area/SearchArea";
import NoTrainData from "../components/train-time-table/NoTrainData";
import ThsrTrainTimeTable from "../components/train-time-table/THSR/ThsrTrainTimeTable";
import TrTrainTimeTable from "../components/train-time-table/TR/TrTrainTimeTable";
import {
  SearchAreaContext,
  SearchAreaUpdateContext,
} from "../contexts/SearchAreaContext";
import {
  SearchAreaActiveIndexEnum,
  SearchAreaLayerEnum,
} from "../enums/SearchAreaParamsEnum";
import usePage from "../hooks/usePageHook";
import useParamsValidation from "../hooks/useParamsValidationHook";
import fetchData from "../services/fetch-data";
import { JsyThsrTrainTimeTable } from "../types/thsr-train-time-table";
import {
  JsyTrTrainTimeTable,
  TrDailyTrainTimetable,
} from "../types/tr-train-time-table";
import DateUtils from "../utils/date-utils";
import { getStationIdByName } from "../utils/station-utils";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
}

/** [頁面] 查詢 */
export default function Search() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          primary: {
            main: `${theme === "light" ? "#6490c4" : "#f59e0b"}`,
            dark: `${theme === "light" ? "#6490c4" : "#f59e0b"}`,
          },
          mode: theme as "light" | "dark",
        },
      }),
    [theme],
  );

  const router = useRouter();
  const { isTr, isThsr, page } = usePage();

  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);

  const { isParamsValid, alertOptions } = useParamsValidation();

  const [isLoading, setIsLoading] = useState(false);
  const [isApiHealth, setIsApiHealth] = useState(true);

  const [trainTimeTable, setTrainTimeTable] =
    useState<JsyTrTrainTimeTable[]>(null);
  const [thsrTrainTimeTable, setThsrTrainTimeTable] =
    useState<JsyThsrTrainTimeTable>(null);

  // 初始化搜尋區域參數 from URL
  const initSearchAreaParams = () => {
    return {
      ...params,
      startStationId: getStationIdByName(
        page,
        router.query.s as string,
        i18n.language,
      ),
      endStationId: getStationIdByName(
        page,
        router.query.e as string,
        i18n.language,
      ),
      date: router.query.d as string,
      time: DateUtils.getTimeByUrlParam(router.query.t as string),
      activeIndex: SearchAreaActiveIndexEnum.EMPTY,
      layer: SearchAreaLayerEnum.FIRST_LAYER,
      inputValue: "",
    };
  };

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
      const updatedParams = initSearchAreaParams();
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

  return (
    <>
      <Head>
        <title>{t(page + "Title")}</title>
      </Head>

      <Layout title={t(page + "Title")}>
        <MuiThemeProvider theme={muiTheme}>
          <SearchArea />

          <div className="mt-7">
            {/* [台鐵] 有列車資料 */}
            {trainTimeTable?.length > 0 && (
              <TrTrainTimeTable dataList={trainTimeTable} />
            )}
            {/* [高鐵] 有列車資料 */}
            {thsrTrainTimeTable?.timeTable?.length > 0 && (
              <ThsrTrainTimeTable data={thsrTrainTimeTable} />
            )}
            {/* 無列車資料 */}
            {((isTr && trainTimeTable?.length <= 0) ||
              (isThsr && thsrTrainTimeTable?.timeTable?.length <= 0)) && (
              <NoTrainData
                isApiHealth={isApiHealth}
                alertMsg={alertOptions.alertMsg}
              />
            )}
          </div>

          <CommonDialog
            open={alertOptions.alertOpen}
            setOpen={alertOptions.setAlertOpen}
            alertMsg={alertOptions.alertMsg}
          />

          {isLoading && <Loading />}
        </MuiThemeProvider>
      </Layout>
    </>
  );
}
