import AdBanner from "@/components/common/AdBanner";
import Loading from "@/components/common/Loading";
import Layout from "@/components/layout/Layout";

import CommonDialog from "@/components/common/CommonDialog";
import OperationAlert from "@/components/search-area/alert/OperationAlert";
import SearchArea from "@/components/search-area/SearchArea";
import DynamicAnnouncements from "@/components/search/DynamicAnnouncements";
import NoTrainData from "@/components/train-time-table/NoTrainData";
import ThsrTrainTimeTable from "@/components/train-time-table/THSR/ThsrTrainTimeTable";
import TrTrainTimeTable from "@/components/train-time-table/TR/TrTrainTimeTable";
import TymcTimeTable from "@/components/train-time-table/TYMC/TymcTimeTable";
import useTrainSearch from "@/hooks/search/useTrainSearch";

import useMuiTheme from "@/hooks/useMuiTheme";
import usePage from "@/hooks/usePage";
import AdUtils from "@/utils/AdUtils";
import DateUtils from "@/utils/DateUtils";
import Alert from "@mui/material/Alert";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { FC, useEffect, useState } from "react";

export async function getServerSideProps({ locale }) {
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
    jsyTrInfo,
    jsyThsrInfo,
    jsyTymcInfo,
  } = useTrainSearch();

  const isGeneralTimetable = isThsr && jsyThsrInfo?.isGeneralTimetable;

  const activeAnnouncements =
    (isTr && jsyTrInfo?.announcements) ||
    (isThsr && jsyThsrInfo?.announcements) ||
    (isTymc && jsyTymcInfo?.announcements) ||
    [];

  const { t } = useTranslation();

  const hasTrData = isTr && jsyTrInfo?.timeTables?.length > 0;
  const hasThsrData = isThsr && jsyThsrInfo?.timeTables?.length > 0;
  const hasTymcData = isTymc && jsyTymcInfo?.timeTables?.length > 0;
  const noData =
    (isTr && jsyTrInfo?.timeTables?.length <= 0) ||
    (isThsr && jsyThsrInfo?.timeTables?.length <= 0) ||
    (isTymc && jsyTymcInfo?.timeTables?.length <= 0);
  const hasResult = hasTrData || hasThsrData || hasTymcData || noData;

  const isDatetimeAlert = alertOptions.alertMsg === "datetimeNotAllowMsg";
  const dialogTitle = isDatetimeAlert ? "reminderAlertTitle" : "";
  const dialogContent = t(alertOptions.alertMsg, {
    date: DateUtils.getCurrentDate(),
  });

  const [showBottomAd, setShowBottomAd] = useState(false);

  useEffect(() => {
    setShowBottomAd(true);
  }, []);

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
            {/* 動態公告 */}
            {hasResult && activeAnnouncements.length > 0 && (
              <div className="pt-2">
                <DynamicAnnouncements announcements={activeAnnouncements} />
              </div>
            )}

            {/* 超過 27 天的高鐵定期時刻表提示 */}
            {hasResult && isGeneralTimetable && (
              <div className="mb-5 pt-2">
                <Alert
                  severity="info"
                  variant="outlined"
                  className="rounded-xl"
                >
                  {t("generalTimetableAlertMsg")}
                </Alert>
              </div>
            )}

            {/* [台鐵] 有列車資料 */}
            {hasTrData && <TrTrainTimeTable dataList={jsyTrInfo?.timeTables} />}

            {/* [高鐵] 有列車資料 */}
            {hasThsrData && <ThsrTrainTimeTable data={jsyThsrInfo} />}

            {/* [桃園捷運] 有列車資料 */}
            {hasTymcData && <TymcTimeTable data={jsyTymcInfo} />}

            {/* 無列車資料 */}
            {noData && (
              <div className="pt-2">
                <NoTrainData
                  isApiHealth={isApiHealth}
                  alertMsg={alertOptions.alertMsg}
                />

                {AdUtils.showAd(0, 0) && (
                  <div className="mt-4">
                    <AdBanner />
                  </div>
                )}
              </div>
            )}
          </div>

          {AdUtils.showAd(0, 0) && showBottomAd && (
            <div>
              <AdBanner mode="bottom" />
            </div>
          )}

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
