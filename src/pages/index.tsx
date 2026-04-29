import Footer from "@/components/layout/Footer";
import Layout from "@/components/layout/Layout";
import PageSeo from "@/components/seo/PageSeo";
import PopularRoutes from "@/components/search-area/PopularRoutes";
import SearchArea from "@/components/search-area/SearchArea";
import SearchHistory from "@/components/search-area/SearchHistory";
import useMuiTheme from "@/hooks/useMuiTheme";
import useSetting from "@/hooks/useSetting";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { FC, useEffect, useState } from "react";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
    // ISR：每天重新產生靜態頁，避免 i18n / 版本資訊長期失效
    revalidate: 86400,
  };
}

/** [頁面] 首頁 */
const Home: FC = () => {
  const muiTheme = useMuiTheme();

  const [hasMounted, setHasMounted] = useState(false);
  /** 從設定讀取是否顯示熱門路線快查 */
  const [showPopularRoutes] = useSetting("showPopularRoutes");

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <>
      <PageSeo />
      <MuiThemeProvider theme={muiTheme}>
        <Layout footer={<Footer />}>
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
        </Layout>
      </MuiThemeProvider>
    </>
  );
};

export default Home;
