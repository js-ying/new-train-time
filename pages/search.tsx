import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import { useContext, useEffect, useMemo, useState } from "react";
import CommonDialog from "../components/CommonDialog";
import Layout from "../components/Layout";
import NoTrainData from "../components/NoTrainData";
import SearchArea from "../components/SearchArea";
import TrainTimeTable from "../components/TrainTimeTable";
import TrainTimeTableNavbar from "../components/TrainTimeTableNavbar";
import {
  SearchAreaContext,
  SearchAreaUpdateContext,
} from "../contexts/SearchAreaContext";
import { PageEnum } from "../enums/Page";
import {
  SearchAreaActiveIndexEnum,
  SearchAreaLayerEnum,
} from "../enums/SearchAreaParamsEnum";
import { trTimeTable } from "../public/mock/trainTimeTable";
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
    setAlertMsg("bothStationAreBlank");
    setAlertOpen(true);
    return false;
  }

  if (!startStationId) {
    setAlertMsg("startStationIsBlank");
    setAlertOpen(true);
    return false;
  }

  if (!endStationId) {
    setAlertMsg("endStationIsBlank");
    setAlertOpen(true);
    return false;
  }

  if (startStationId === endStationId) {
    setAlertMsg("sameStation");
    setAlertOpen(true);
    return false;
  }

  if (
    DateUtils.isBefore(date, DateUtils.getCurrentDate()) ||
    DateUtils.isAfter(date, DateUtils.addMonth(DateUtils.getCurrentDate(), 2))
  ) {
    setAlertMsg("datetimeNotAllow");
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
            main: `${theme === "light" ? "#6490c4" : "rgb(245 158 11)"}`,
            dark: `${theme === "light" ? "#6490c4" : "rgb(245 158 11)"}`,
          },
          mode: theme as "light" | "dark",
        },
      }),
    [theme],
  );
  const router = useRouter();
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);
  const [trainTimeTable, setTrainTimeTable] = useState([]);
  const isTr = page === PageEnum.TR;
  const isThsr = page === PageEnum.THSR;

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
  const getTrainTimeTable = () => {
    console.log("getTrainTimeTable...");
    if (isTr) {
      const result = trTimeTable;
      if (result?.TrainTimetables?.length > 0) {
        setTrainTimeTable([...trTimeTable.TrainTimetables]);
      }
    }
  };

  useEffect(() => {
    // 一般導頁永遠都是 true，重新整理一開始是 false 需等待變 true
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
        // getTrainTimeTable();
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  return (
    <Layout title={t(page + "Title")} page={page}>
      <MuiThemeProvider theme={muiTheme}>
        <SearchArea page={page} />
        {/* 有列車資料 */}
        {trainTimeTable.length > 0 ? (
          <>
            <div className="mt-7">
              <TrainTimeTableNavbar page={page} dataList={trainTimeTable} />
            </div>
            <div className="mt-4">
              <TrainTimeTable page={page} dataList={trainTimeTable} />
            </div>
          </>
        ) : (
          // 無列車資料
          <div className="mt-7">
            <NoTrainData />
          </div>
        )}

        <CommonDialog
          open={alertOpen}
          setOpen={setAlertOpen}
          alertMsg={alertMsg}
        />
      </MuiThemeProvider>
    </Layout>
  );
}
