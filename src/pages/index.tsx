import Layout from "@/components/layout/Layout";
import PopularRoutes from "@/components/search-area/PopularRoutes";
import SearchArea from "@/components/search-area/SearchArea";
import SearchHistory from "@/components/search-area/SearchHistory";
import PageSeo from "@/components/seo/PageSeo";
import useMuiTheme from "@/hooks/useMuiTheme";
import { JsyPopularRoutes } from "@/models/jsy-popular-routes";
import { getHomeStaticProps } from "@/services/popularRoutesService";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { FC } from "react";

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

  return (
    <>
      <PageSeo />
      <MuiThemeProvider theme={muiTheme}>
        <Layout>
          {/* 搜尋區塊 */}
          <SearchArea />

          <div className="mt-5 text-center empty:hidden">
            {/* 歷史查詢區塊 */}
            <SearchHistory />
          </div>

          {/* 熱門路線區塊 (由 _document、SettingContext 控制顯示) */}
          <div className="js-popular-routes mt-7">
            <PopularRoutes popularRoutes={popularRoutes} />
          </div>
        </Layout>
      </MuiThemeProvider>
    </>
  );
};

export default Home;
