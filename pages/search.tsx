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
import { PageEnum } from "../enums/Page";
import {
  SearchAreaActiveIndexEnum,
  SearchAreaLayerEnum,
} from "../enums/SearchAreaParamsEnum";
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

/** 參數是否合法 */
export const isParamsValid = (
  startStationId: string,
  endStationId: string,
  date: string,
  setAlertMsg: Function,
  setAlertOpen: Function,
): boolean => {
  if (!startStationId && !endStationId) {
    setAlertMsg("bothStationAreBlankMsg");
    setAlertOpen(true);
    return false;
  }

  if (!startStationId) {
    setAlertMsg("startStationIsBlankMsg");
    setAlertOpen(true);
    return false;
  }

  if (!endStationId) {
    setAlertMsg("endStationIsBlankMsg");
    setAlertOpen(true);
    return false;
  }

  if (startStationId === endStationId) {
    setAlertMsg("sameStationMsg");
    setAlertOpen(true);
    return false;
  }

  if (
    DateUtils.isBefore(date, DateUtils.getCurrentDate()) ||
    DateUtils.isAfter(date, DateUtils.addMonth(DateUtils.getCurrentDate(), 2))
  ) {
    setAlertMsg("datetimeNotAllowMsg");
    setAlertOpen(true);
    return false;
  }

  return true;
};

/** [頁面] 查詢 */
export default function Search({ page = PageEnum.TR }) {
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
  const isTr = page === PageEnum.TR;
  const isThsr = page === PageEnum.THSR;

  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);

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

        setAlertMsg(error);
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
          setThsrTrainTimeTable(null);
        }
        setIsApiHealth(true);
      } catch (error) {
        setThsrTrainTimeTable(null);

        setIsApiHealth(false);

        setAlertMsg(error);
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
          setAlertMsg,
          setAlertOpen,
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

      <Layout title={t(page + "Title")} page={page}>
        <MuiThemeProvider theme={muiTheme}>
          <SearchArea page={page} />

          <div className="mt-7">
            {/* [台鐵] 有列車資料 */}
            {trainTimeTable?.length > 0 && (
              <TrTrainTimeTable page={page} dataList={trainTimeTable} />
            )}

            {/* [高鐵] 有列車資料 */}
            {thsrTrainTimeTable && (
              <ThsrTrainTimeTable page={page} data={thsrTrainTimeTable} />
            )}

            {/* 無列車資料 */}
            {trainTimeTable?.length <= 0 && !thsrTrainTimeTable && (
              <NoTrainData isApiHealth={isApiHealth} alertMsg={alertMsg} />
            )}
          </div>

          <CommonDialog
            open={alertOpen}
            setOpen={setAlertOpen}
            alertMsg={alertMsg}
          />

          {isLoading && <Loading />}
        </MuiThemeProvider>
      </Layout>
    </>
  );
}
