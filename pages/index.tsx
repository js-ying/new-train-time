import { ThemeProvider as MuiThemeProvider } from "@mui/material";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { FC } from "react";
import Disclaimer from "../components/Disclaimer";
import Layout from "../components/Layout";
import SearchArea from "../components/search-area/SearchArea";
import SearchHistory from "../components/search-area/SearchHistory";
import useMuiTheme from "../hooks/useMuiThemeHook";
import usePage from "../hooks/usePageHook";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
}

/** [頁面] 首頁 */
const Home: FC = () => {
  const { t } = useTranslation();
  const muiTheme = useMuiTheme();
  const { page } = usePage();

  return (
    <>
      <Head>
        <title>{t(`${page}Title`)}</title>
      </Head>

      <Layout title={t(`${page}Title`)}>
        <MuiThemeProvider theme={muiTheme}>
          <SearchArea />
          <div className="mt-7">
            <SearchHistory />
          </div>
          <div className="mt-7">
            <Disclaimer />
          </div>
        </MuiThemeProvider>
      </Layout>
    </>
  );
};

export default Home;
