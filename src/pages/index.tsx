import Disclaimer from "@/components/common/Disclaimer";
import NewLabel from "@/components/common/NewLabel";
import Layout from "@/components/layout/Layout";
import PopularRoutes from "@/components/search-area/PopularRoutes";
import SearchArea from "@/components/search-area/SearchArea";
import SearchHistory from "@/components/search-area/SearchHistory";
import OrderDescription from "@/components/train-time-table/OrderDescription";
import useMuiTheme from "@/hooks/useMuiTheme";
import usePage from "@/hooks/usePage";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
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
  const { t } = useTranslation();
  const muiTheme = useMuiTheme();
  const { isTr, isThsr } = usePage();

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <>
      <MuiThemeProvider theme={muiTheme}>
        <Layout>
          {/* 搜尋區塊 */}
          <SearchArea />

          <div className="mt-7">
            {/* 歷史查詢區塊 */}
            <SearchHistory />
          </div>

          {hasMounted && (
            <>
              {/* 熱門路線區塊 */}
              <div className="mt-7">
                <PopularRoutes />
              </div>

              {/* 免責聲明區塊 */}
              <div className="mt-7">
                <Disclaimer />
              </div>

              {/* 訂票說明區塊 (台鐵/高鐵專屬) */}
              {(isTr || isThsr) && (
                <div className="mt-1 flex justify-center">
                  <div className="relative">
                    <OrderDescription />
                    <div className="absolute left-full top-1 ml-1.5">
                      <NewLabel />
                    </div>
                  </div>
                </div>
              )}

              {/* 版本資訊 */}
              <div className="mt-1 text-center text-sm text-zinc-500 dark:text-zinc-400">
                ver. {updateDataList[0].ver}
              </div>
            </>
          )}

          <footer className="-mb-6 mt-auto pb-2 pt-10 text-xs text-zinc-400 dark:text-zinc-600">
            <nav className="flex gap-x-1.5">
              <Link href="/terms" className="hover:underline">
                {t("termsOfService")}
              </Link>
              <span aria-hidden="true">·</span>
              <Link href="/privacy" className="hover:underline">
                {t("privacyPolicy")}
              </Link>
            </nav>
          </footer>
        </Layout>
      </MuiThemeProvider>
    </>
  );
};

export default Home;
