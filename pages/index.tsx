import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTheme } from "next-themes";
import Head from "next/head";
import { useMemo } from "react";
import Layout from "../components/Layout";
import SearchArea from "../components/search-area/SearchArea";
import SearchHistory from "../components/search-area/SearchHistory";
import { PageEnum } from "../enums/Page";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
}

/** [頁面] 首頁 */
export default function Home({ page = PageEnum.TR }) {
  const { t } = useTranslation();
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

  return (
    <>
      <Head>
        <title>{t(page + "Title")}</title>
      </Head>

      <Layout title={t(page + "Title")} page={page}>
        <MuiThemeProvider theme={muiTheme}>
          <SearchArea page={page} />
          <div className="mt-7">
            <SearchHistory page={page} />
          </div>
        </MuiThemeProvider>
      </Layout>
    </>
  );
}
