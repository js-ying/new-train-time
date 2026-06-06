import Layout from "@/components/layout/Layout";
import PopularRoutes from "@/components/search-area/PopularRoutes";
import SearchArea from "@/components/search-area/SearchArea";
import SearchHistory from "@/components/search-area/SearchHistory";
import PageSeo from "@/components/seo/PageSeo";
import useMuiTheme from "@/hooks/useMuiTheme";
import useSetting from "@/hooks/useSetting";
import { JsyPopularRoutes } from "@/models/jsy-popular-routes";
import { getHomeStaticProps } from "@/services/popularRoutesService";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { FC, useEffect, useState } from "react";

export async function getStaticProps({ locale }) {
  return getHomeStaticProps(locale);
}

interface HomeProps {
  /** 由 getStaticProps 注入的三鐵路熱門路線（DB 取數，失敗時為 fallback） */
  popularRoutes?: JsyPopularRoutes;
}

/** [頁面] 首頁 */
const Home: FC<HomeProps> = ({ popularRoutes }) => {
  const muiTheme = useMuiTheme();

  const [hasMounted, setHasMounted] = useState(false);
  /** 從設定讀取是否顯示熱門路線快查 */
  const [showPopularRoutes] = useSetting("showPopularRoutes");

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // 熱門路線預設於 SSR 即渲染；
  // 待 client 掛載後才套用使用者「隱藏熱門路線」設定。SSR 與 client 首次渲染
  // 皆 hasMounted=false → 輸出一致，不會 hydration mismatch。
  const showRoutes = !hasMounted || showPopularRoutes;

  return (
    <>
      <PageSeo />
      <MuiThemeProvider theme={muiTheme}>
        <Layout>
          {/* 搜尋區塊 */}
          <SearchArea />

          <div className="mt-7 empty:hidden">
            {/* 歷史查詢區塊 */}
            <SearchHistory />
          </div>

          {/* 熱門路線區塊：SSR 預設顯示、client 端依設定控制 */}
          {showRoutes && (
            <div className="mt-7">
              <PopularRoutes popularRoutes={popularRoutes} />
            </div>
          )}
        </Layout>
      </MuiThemeProvider>
    </>
  );
};

export default Home;
