import AdBanner from "@/components/AdBanner";
import Layout from "@/components/layout/Layout";
import Loading from "@/components/layout/Loading";

import CommonDialog from "@/components/CommonDialog";
import OperationAlert from "@/components/search-area/alerts/OperationAlert";
import SearchArea from "@/components/search-area/SearchArea";
import NoTrainData from "@/components/train-time-table/NoTrainData";
import ThsrTrainTimeTable from "@/components/train-time-table/THSR/ThsrTrainTimeTable";
import TrTrainTimeTable from "@/components/train-time-table/TR/TrTrainTimeTable";
import TymcTimeTable from "@/components/train-time-table/TYMC/TymcTimeTable";
import useMuiTheme from "@/hooks/useMuiThemeHook";
import usePage from "@/hooks/usePageHook";
import useTrainSearch from "@/hooks/useTrainSearchHook";
import AdUtils from "@/utils/AdUtils";
import DateUtils from "@/utils/DateUtils";
import { ThemeProvider as MuiThemeProvider } from "@mui/material";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
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
  const hasResult = hasTrData || hasThsrData || hasTymcData || noData;

  const isDatetimeAlert = alertOptions.alertMsg === "datetimeNotAllowMsg";
  const dialogTitle = isDatetimeAlert ? "reminderAlertTitle" : "";
  const dialogContent = t(alertOptions.alertMsg, {
    date: DateUtils.getCurrentDate(),
  });

  return (
    <>
      <MuiThemeProvider theme={muiTheme}>
        <Layout>
          <div className="relative">
            <SearchArea />

            {hasResult && (
              <div className="absolute bottom-1 left-3">
                <OperationAlert />
              </div>
            )}
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
            title={dialogTitle}
          >
            {dialogContent}
          </CommonDialog>

          {isLoading && <Loading />}
        </Layout>
      </MuiThemeProvider>
    </>
  );
};

export default Search;
