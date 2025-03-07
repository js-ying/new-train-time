import Disclaimer from "@/components/layout/Disclaimer";
import Layout from "@/components/layout/Layout";
import PageHead from "@/components/layout/PageHead";
import SearchArea from "@/components/search-area/SearchArea";
import SearchHistory from "@/components/search-area/SearchHistory";
import TrOrderDescription from "@/components/train-time-table/TrOrderDescription";
import useMuiTheme from "@/hooks/useMuiThemeHook";
import usePage from "@/hooks/usePageHook";
import { ThemeProvider as MuiThemeProvider } from "@mui/material";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { FC, useEffect, useState } from "react";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
}

/** [頁面] 首頁 */
const Home: FC = () => {
  const muiTheme = useMuiTheme();
  const { isTr } = usePage();

  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    setShowDisclaimer(true);
  }, []);

  return (
    <>
      <PageHead />
      <MuiThemeProvider theme={muiTheme}>
        <Layout>
          <SearchArea />
          <div className="mt-7">
            <SearchHistory />
          </div>
          <div className="mt-7">{showDisclaimer && <Disclaimer />}</div>

          {isTr && showDisclaimer && <TrOrderDescription />}
        </Layout>
      </MuiThemeProvider>
    </>
  );
};

export default Home;
