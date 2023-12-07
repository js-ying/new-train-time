import { useContext, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useTheme } from "next-themes";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material";
import Layout from "../../components/Layout";
import SearchArea from "../../components/SearchArea";
import {
  SearchAreaContext,
  SearchAreaUpdateContext,
} from "../../contexts/SearchAreaContext";
import { getTrStationIdByName } from "../../utils/station-utils";
import DateUtils from "../../utils/date-utils";
import { PageEnum } from "../../enums/Page";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
}

export default function Search() {
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

  // 初始化和更新參數
  useEffect(() => {
    // for 重新整理頁面的情境 (一般導頁永遠都是 true)
    if (router.isReady) {
      setParams({
        ...params,
        startStationId: getTrStationIdByName(
          router.query.s as string,
          i18n.language,
        ),
        endStationId: getTrStationIdByName(
          router.query.e as string,
          i18n.language,
        ),
        date: router.query.d,
        time: DateUtils.getTimeByUrlParam(router.query.t as string),
        activeIndex: null,
        layer: 0,
        inputValue: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  return (
    <Layout title={t("title")} page={PageEnum.TR}>
      <MuiThemeProvider theme={muiTheme}>
        <SearchArea page={PageEnum.TR} />
      </MuiThemeProvider>
    </Layout>
  );
}
