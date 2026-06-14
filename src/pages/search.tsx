import AdBanner from "@/components/common/AdBanner";
import Loading from "@/components/common/Loading";
import Layout from "@/components/layout/Layout";

import CommonDialog from "@/components/common/CommonDialog";
import DynamicAnnouncements from "@/components/search-area/alert/DynamicAnnouncements";
import OperationAlert from "@/components/search-area/alert/OperationAlert";
import SearchArea from "@/components/search-area/SearchArea";
import SearchResultSeoContent from "@/components/search-area/SearchResultSeoContent";
import PageSeo from "@/components/seo/PageSeo";
import NoTrainData from "@/components/train-time-table/NoTrainData";
import ThsrTrainTimeTable from "@/components/train-time-table/THSR/ThsrTrainTimeTable";
import TrTransferTimeTable from "@/components/train-time-table/TR/transfer/TrTransferTimeTable";
import TrTrainTimeTable from "@/components/train-time-table/TR/TrTrainTimeTable";
import TymcTimeTable from "@/components/train-time-table/TYMC/TymcTimeTable";
import { SearchAreaContext } from "@/contexts/SearchAreaContext";
import useSearchMode from "@/hooks/search/useSearchMode";
import useTrainSearch from "@/hooks/search/useTrainSearch";

import useMuiTheme from "@/hooks/useMuiTheme";
import usePage from "@/hooks/usePage";
import { ReportTrainType } from "@/services/reportService";
import AdUtils from "@/utils/AdUtils";
import DateUtils from "@/utils/DateUtils";
import Alert from "@mui/material/Alert";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { FC, useContext, useEffect, useState } from "react";

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
  const { isTransfer } = useSearchMode();
  const searchAreaParams = useContext(SearchAreaContext);
  const {
    isLoading,
    apiError,
    validationAlert,
    jsyTrInfo,
    jsyTrTransferInfo,
    jsyThsrInfo,
    jsyTymcInfo,
  } = useTrainSearch();

  // 「無轉乘方案」錯誤回報需要的查詢條件；目前僅 TR 有 transfer 模式
  // 三個欄位都齊備才傳給 NoTrainData，避免初始載入時 date=null 誤送
  const reportTrainType: ReportTrainType | null = isTr
    ? "TR"
    : isThsr
      ? "THSR"
      : isTymc
        ? "TYMC"
        : null;
  const reportPayload =
    reportTrainType &&
    searchAreaParams?.startStationId &&
    searchAreaParams?.endStationId &&
    searchAreaParams?.date
      ? {
          trainType: reportTrainType,
          startStationId: searchAreaParams.startStationId,
          endStationId: searchAreaParams.endStationId,
          date: searchAreaParams.date,
        }
      : undefined;

  const isGeneralTimetable = isThsr && jsyThsrInfo?.isGeneralTimetable;

  // transfer mode 走 jsyTrTransferInfo；direct / 其他鐵路維持原本來源
  const activeAnnouncements =
    (isTr && isTransfer && jsyTrTransferInfo?.announcements) ||
    (isTr && !isTransfer && jsyTrInfo?.announcements) ||
    (isThsr && jsyThsrInfo?.announcements) ||
    (isTymc && jsyTymcInfo?.announcements) ||
    [];

  const { t } = useTranslation();
  const hasTrDirectData =
    isTr && !isTransfer && jsyTrInfo?.timeTables?.length > 0;
  const hasTrTransferData =
    isTr && isTransfer && jsyTrTransferInfo?.combinations?.length > 0;
  const hasThsrData = isThsr && jsyThsrInfo?.timeTables?.length > 0;
  const hasTymcData = isTymc && jsyTymcInfo?.timeTables?.length > 0;
  // API 錯誤或查詢回空陣列都歸為「無資料」狀態，由 NoTrainData 內部依 apiError 切黃 / 紅 Alert
  const noData =
    !!apiError ||
    (isTr && !isTransfer && jsyTrInfo?.timeTables?.length === 0) ||
    (isTr && isTransfer && jsyTrTransferInfo?.combinations?.length === 0) ||
    (isThsr && jsyThsrInfo?.timeTables?.length === 0) ||
    (isTymc && jsyTymcInfo?.timeTables?.length === 0);
  const hasResult =
    hasTrDirectData ||
    hasTrTransferData ||
    hasThsrData ||
    hasTymcData ||
    noData;

  const isDatetimeAlert = validationAlert.message === "datetimeNotAllowMsg";
  const dialogTitle = isDatetimeAlert ? "reminderAlertTitle" : "";
  const dialogContent = t(validationAlert.message, {
    date: DateUtils.getCurrentDate(),
  });

  const [showBottomAd, setShowBottomAd] = useState(false);

  useEffect(() => {
    setShowBottomAd(true);
  }, []);

  return (
    <>
      <PageSeo />
      <MuiThemeProvider theme={muiTheme}>
        <Layout>
          <SearchResultSeoContent />

          <div className="relative">
            <SearchArea />

            {hasResult && (
              <div className="absolute bottom-1 left-3">
                <OperationAlert />
              </div>
            )}

            {/* 常用路線（收藏愛心）暫時隱藏，待與付費方案一起上線 */}
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

            {/* [台鐵] 直達 */}
            {hasTrDirectData && (
              <TrTrainTimeTable dataList={jsyTrInfo?.timeTables} />
            )}

            {/* [台鐵] 跨支線轉乘 */}
            {hasTrTransferData && (
              <TrTransferTimeTable
                data={jsyTrTransferInfo}
                reportPayload={reportPayload}
              />
            )}

            {/* [高鐵] 有列車資料 */}
            {hasThsrData && <ThsrTrainTimeTable data={jsyThsrInfo} />}

            {/* [桃園捷運] 有列車資料 */}
            {hasTymcData && <TymcTimeTable data={jsyTymcInfo} />}

            {/* 無列車資料 */}
            {noData && (
              <div className="pt-2">
                <NoTrainData
                  apiError={apiError}
                  isTransfer={isTr && isTransfer}
                  isTr={isTr}
                  reportPayload={reportPayload}
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
            open={validationAlert.open}
            setOpen={validationAlert.setOpen}
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
