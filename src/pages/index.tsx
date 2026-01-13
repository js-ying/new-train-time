import Disclaimer from "@/components/common/Disclaimer";
import NewLabel from "@/components/common/NewLabel";
import Layout from "@/components/layout/Layout";
import SearchArea from "@/components/search-area/SearchArea";
import SearchHistory from "@/components/search-area/SearchHistory";
import OrderDescription from "@/components/train-time-table/OrderDescription";
import useMuiTheme from "@/hooks/useMuiTheme";
import usePage from "@/hooks/usePage";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { updateDataList } from "public/data/updatesData";
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
  const { isTr, isThsr } = usePage();

  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    setShowDisclaimer(true);
  }, []);

  return (
    <>
      <MuiThemeProvider theme={muiTheme}>
        <Layout>
          <SearchArea />
          <div className="mt-7">
            <SearchHistory />
          </div>
          <div className="mt-7">{showDisclaimer && <Disclaimer />}</div>
          {(isTr || isThsr) && showDisclaimer && (
            <div className="mt-1 flex justify-center">
              <div className="relative">
                <OrderDescription />
                <div className="absolute left-full top-1 ml-1.5">
                  <NewLabel />
                </div>
              </div>
            </div>
          )}

          <div className="mt-1 text-center text-sm text-zinc-500 dark:text-zinc-400">
            ver. {updateDataList[0].ver}
          </div>
        </Layout>
      </MuiThemeProvider>
    </>
  );
};

export default Home;
