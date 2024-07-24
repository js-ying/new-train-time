import { ThemeProvider as MuiThemeProvider } from "@mui/material";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { FC } from "react";
import AdBanner from "../components/AdBanner";
import CommonDialog from "../components/CommonDialog";
import Layout from "../components/Layout";
import Loading from "../components/Loading";
import TyphoonAlert from "../components/TyphoonAlert";
import SearchArea from "../components/search-area/SearchArea";
import NoTrainData from "../components/train-time-table/NoTrainData";
import ThsrTrainTimeTable from "../components/train-time-table/THSR/ThsrTrainTimeTable";
import TrTrainTimeTable from "../components/train-time-table/TR/TrTrainTimeTable";
import useMuiTheme from "../hooks/useMuiThemeHook";
import usePage from "../hooks/usePageHook";
import useTrainSearch from "../hooks/useTrainSearchHook";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
}

/** [頁面] 查詢 */
const Search: FC = () => {
  const muiTheme = useMuiTheme();
  const { isTr, isThsr } = usePage();
  const {
    isLoading,
    isApiHealth,
    alertOptions,
    trainTimeTable,
    thsrTrainTimeTable,
  } = useTrainSearch();

  const hasTrData = isTr && trainTimeTable?.length > 0;
  const hasThsrData = isThsr && thsrTrainTimeTable?.timeTable?.length > 0;
  const noData =
    (isTr && trainTimeTable?.length <= 0) ||
    (isThsr && thsrTrainTimeTable?.timeTable?.length <= 0);

  return (
    <MuiThemeProvider theme={muiTheme}>
      <Layout>
        <SearchArea />

        <div className="mt-7">
          <TyphoonAlert />
        </div>

        <div className="mt-5">
          {/* [台鐵] 有列車資料 */}
          {hasTrData && <TrTrainTimeTable dataList={trainTimeTable} />}

          {/* [高鐵] 有列車資料 */}
          {hasThsrData && <ThsrTrainTimeTable data={thsrTrainTimeTable} />}

          {/* 無列車資料 */}
          {noData && (
            <>
              <NoTrainData
                isApiHealth={isApiHealth}
                alertMsg={alertOptions.alertMsg}
              />

              <div className="mt-4">
                <AdBanner />
              </div>
            </>
          )}
        </div>

        <CommonDialog
          open={alertOptions.alertOpen}
          setOpen={alertOptions.setAlertOpen}
          msg={alertOptions.alertMsg}
        />

        {isLoading && <Loading />}
      </Layout>
    </MuiThemeProvider>
  );
};

export default Search;
