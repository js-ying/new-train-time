import Layout from "@/components/layout/Layout";
import PopularRoutes from "@/components/search-area/PopularRoutes";
import SearchArea from "@/components/search-area/SearchArea";
import SearchHistory from "@/components/search-area/SearchHistory";
import useMuiTheme from "@/hooks/useMuiTheme";
import useSetting from "@/hooks/useSetting";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { updateDataList } from "@/data/updatesData";
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

  const [hasMounted, setHasMounted] = useState(false);
  /** 從設定讀取是否顯示熱門路線快查 */
  const [showPopularRoutes] = useSetting("showPopularRoutes");

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <>
      <MuiThemeProvider theme={muiTheme}>
        <Layout>
          {/* 搜尋區塊 */}
          <SearchArea />

          <div className="mt-7 empty:hidden">
            {/* 歷史查詢區塊 */}
            <SearchHistory />
          </div>

          {hasMounted && (
            <>
              {/* 熱門路線區塊：由設定控制顯示 */}
              {showPopularRoutes && (
                <div className="mt-7">
                  <PopularRoutes />
                </div>
              )}
            </>
          )}

          <footer className="mx-auto -mb-5 mt-auto flex flex-col items-center gap-y-2 pb-2 pt-10 text-xs text-zinc-400 dark:text-zinc-500">
            <nav className="flex gap-x-1.5">
              {/* 版本資訊 */}
              <a href="/updates" className="hover:underline">
                Ver. {updateDataList[0].ver}
              </a>
              <span aria-hidden="true">·</span>
              {/* 服務條款 */}
              <Link href="/terms" className="hover:underline">
                {t("termsOfService")}
                <span className="sr-only">Terms of Service</span>
              </Link>
              <span aria-hidden="true">·</span>
              {/* 隱私權政策 */}
              <Link href="/privacy" className="hover:underline">
                {t("privacyPolicy")}
                <span className="sr-only">Privacy Policy</span>
              </Link>
            </nav>
          </footer>
        </Layout>
      </MuiThemeProvider>
    </>
  );
};

export default Home;
