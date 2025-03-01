import AdBanner from "@/components/AdBanner";
import Layout from "@/components/layout/Layout";
import Loading from "@/components/layout/Loading";

import OperationAlert from "@/components/alerts/OperationAlert";
import CommonDialog from "@/components/modals/CommonDialog";
import SearchArea from "@/components/search-area/SearchArea";
import NoTrainData from "@/components/train-time-table/NoTrainData";
import ThsrTrainTimeTable from "@/components/train-time-table/THSR/ThsrTrainTimeTable";
import TrTrainTimeTable from "@/components/train-time-table/TR/TrTrainTimeTable";
import TymcTimeTable from "@/components/train-time-table/TYMC/TymcTimeTable";
import useMuiTheme from "@/hooks/useMuiThemeHook";
import usePage from "@/hooks/usePageHook";
import useTrainSearch from "@/hooks/useTrainSearchHook";
import AdUtils from "@/utils/AdUtils";
import { ThemeProvider as MuiThemeProvider } from "@mui/material";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { FC } from "react";

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
  const { isTr, isThsr, isTymc } = usePage();
  const {
    isLoading,
    isApiHealth,
    alertOptions,
    trainTimeTable,
    jsyThsrInfo,
    jsyTymcInfo,
  } = useTrainSearch();
  const { t } = useTranslation();

  const hasTrData = isTr && trainTimeTable?.length > 0;
  const hasThsrData = isThsr && jsyThsrInfo?.timeTable?.length > 0;
  const hasTymcData = isTymc && jsyTymcInfo?.timeTables?.length > 0;
  const noData =
    (isTr && trainTimeTable?.length <= 0) ||
    (isThsr && jsyThsrInfo?.timeTable?.length <= 0) ||
    (isTymc && jsyTymcInfo?.timeTables?.length <= 0);

  return (
    <MuiThemeProvider theme={muiTheme}>
      <Layout>
        <Head>
          <meta name="description" content={t("searchDescription")} />
        </Head>
        <div className="relative">
          <SearchArea />

          <div className="absolute bottom-1 left-3">
            <OperationAlert />
          </div>
        </div>

        <div className="mt-5">
          {/* [台鐵] 有列車資料 */}
          {hasTrData && <TrTrainTimeTable dataList={trainTimeTable} />}

          {/* [高鐵] 有列車資料 */}
          {hasThsrData && <ThsrTrainTimeTable data={jsyThsrInfo} />}

          {/* [桃園捷運] 有列車資料 */}
          {hasTymcData && <TymcTimeTable data={jsyTymcInfo} />}

          {/* 無列車資料 */}
          {noData && (
            <>
              <NoTrainData
                isApiHealth={isApiHealth}
                alertMsg={alertOptions.alertMsg}
              />

              {AdUtils.showAd(0, 0) && (
                <div className="mt-4">
                  <AdBanner />
                </div>
              )}
            </>
          )}
        </div>

        <CommonDialog
          open={alertOptions.alertOpen}
          setOpen={alertOptions.setAlertOpen}
        >
          {t(alertOptions.alertMsg)}
        </CommonDialog>

        {isLoading && <Loading />}
      </Layout>
    </MuiThemeProvider>
  );
};

export default Search;
