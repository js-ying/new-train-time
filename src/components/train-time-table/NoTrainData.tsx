import CommonDialog from "@/components/common/CommonDialog";
import { ApiError } from "@/models/problem-details";
import { postTransferReport, ReportTrainType } from "@/services/reportService";
import DateUtils from "@/utils/DateUtils";
import { Button } from "@heroui/react";
import Alert from "@mui/material/Alert";
import { useTranslation } from "next-i18next";
import { FC, useEffect, useMemo, useState } from "react";
import { LocaleEnum } from "../../enums/LocaleEnum";

interface NoTrainDataProps {
  /** 來自 useTrainSearch 的 API 錯誤；非 null 即顯示紅 Alert */
  apiError: ApiError | null;
  /** 是否為轉乘模式無資料；切換 Alert 文案（含「可能不需轉乘」常見原因） */
  isTransfer?: boolean;
  /** 是否為台鐵（TR）；direct 模式無資料時用以追加「改試轉乘」引導 */
  isTr?: boolean;
  /** 當前查詢條件；提供完整即可在轉乘模式下顯示「錯誤回報」按鈕 */
  reportPayload?: {
    trainType: ReportTrainType;
    startStationId: string;
    endStationId: string;
    date: string;
  };
}

/**
 * 搜尋結果無資料時的占位元件：
 * - apiError 為 null：黃色 Alert，提示「時段太晚 / 兩站無班次」
 * - apiError 非 null：紅色 Alert，依 ApiError.code 對應 i18n 訊息
 * - isTransfer：轉乘模式專用文案（提示可能不需轉乘，可改試直達）
 *   並追加「我確定此查詢條件有轉乘方案」錯誤回報入口（需提供 reportPayload）
 * - isTr + direct：追加「可能無直達，可改試轉乘」引導（高鐵/桃捷無 transfer 模式不顯示）
 */
const NoTrainData: FC<NoTrainDataProps> = ({
  apiError,
  isTransfer,
  isTr,
  reportPayload,
}) => {
  const { t, i18n } = useTranslation();

  // 錯誤回報狀態：reported 用於同次查詢避免重覆送出；查詢條件變動即 reset
  const [isReporting, setIsReporting] = useState(false);
  const [hasReported, setHasReported] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportDialogContent, setReportDialogContent] = useState<{
    titleKey: string;
    messageKey: string;
  } | null>(null);

  // 將查詢條件壓成 key；變更時視為「重新查詢」，重置已回報狀態以允許再次回報
  const reportKey = useMemo(() => {
    if (!reportPayload) return "";
    const { trainType, startStationId, endStationId, date } = reportPayload;
    return `${trainType}|${startStationId}|${endStationId}|${date}`;
  }, [reportPayload]);

  useEffect(() => {
    setHasReported(false);
  }, [reportKey]);

  // 點擊「錯誤回報」按鈕：fire-and-forget 提交後依結果顯示 dialog
  const handleReport = async () => {
    if (!reportPayload || isReporting || hasReported) return;
    setIsReporting(true);
    try {
      await postTransferReport(reportPayload);
      setHasReported(true);
      setReportDialogContent({
        titleKey: "reportTransferSuccessTitle",
        messageKey: "reportTransferSuccessMsg",
      });
      setReportDialogOpen(true);
    } catch (err) {
      // 與既有錯誤呈現一致：依 ApiError.code 走 errors.* i18n；未知時用 UNKNOWN
      const code = err instanceof ApiError && err.code ? err.code : "UNKNOWN";
      const errorKey = `errors.${code}`;
      setReportDialogContent({
        titleKey: "reportTransferFailedTitle",
        messageKey: i18n.exists(errorKey) ? errorKey : "errors.UNKNOWN",
      });
      setReportDialogOpen(true);
    } finally {
      setIsReporting(false);
    }
  };

  if (apiError) {
    const messageKey = `errors.${apiError.code}`;
    const messageText = i18n.exists(messageKey)
      ? t(messageKey)
      : t("noTrainDataDueToApiErrorMsg");
    const trailingSpace = i18n.language === LocaleEnum.TW ? "" : " ";

    return (
      <Alert severity="error" variant="outlined" className="rounded-xl">
        <div className="font-bold">
          {messageText}
          {trailingSpace}
          {`(${DateUtils.getCurrentDatetime()})`}
        </div>
      </Alert>
    );
  }

  if (isTransfer) {
    // 只有提供完整 reportPayload 時才顯示「錯誤回報」入口；否則退化為兩點
    const canReport = !!reportPayload;
    return (
      <>
        <Alert
          severity="warning"
          variant="outlined"
          className="rounded-xl"
          // MUI Alert root 為 flex，.MuiAlert-message 預設無 flex-grow，寬度會收
          // 到內容寬度；強制 flex-1 讓 message 撐滿，items-center 才能對到 Alert
          // 內可放文字寬度（icon 右側到右 padding 之間）的中心
          classes={{ message: "flex-1" }}
        >
          <div className="mb-3 font-bold">{t("noTransferDataTitleMsg")}</div>
          {/* Tailwind Preflight 會把 ul 的 list-style 重置成 none，需用 list-disc 還原符號 */}
          <ul className="list-inside list-disc">
            <li>{t("noTransferInThisTimeMsg")}</li>
            <li>{t("noTransferDueToDirectMsg")}</li>
            {/* 第三點：prefix 文字一律以 li 呈現（與前兩點對齊）；按鈕僅 PC 接在文字後 */}
            {canReport && (
              <li>
                {t("reportTransferIssuePrefix")}
                <Button
                  size="md"
                  variant="light"
                  isLoading={isReporting}
                  isDisabled={hasReported || isReporting}
                  onPress={handleReport}
                  className="-ml-1.5 hidden h-auto min-h-fit min-w-fit border-orange-500 px-2 py-0.5 text-orange-500 md:inline-flex dark:border-orange-400 dark:text-orange-400"
                >
                  {hasReported
                    ? t("reportTransferIssueBtnDone")
                    : t("reportTransferIssueBtn")}
                </Button>
              </li>
            )}
          </ul>
          {/* 手機版：按鈕另起一行置中，prefix 文字已在上方 li 內 */}
          {canReport && (
            <div className="mt-2 flex justify-center md:hidden">
              <Button
                size="md"
                variant="light"
                isLoading={isReporting}
                isDisabled={hasReported || isReporting}
                onPress={handleReport}
                className="h-auto min-h-fit min-w-fit border-orange-500 px-2 py-0.5 text-orange-500 dark:border-orange-400 dark:text-orange-400"
              >
                {hasReported
                  ? t("reportTransferIssueBtnDone")
                  : t("reportTransferIssueBtn")}
              </Button>
            </div>
          )}
        </Alert>

        {/* 回報結果通知（成功 / 失敗共用，依 titleKey / messageKey 切換） */}
        <CommonDialog
          open={reportDialogOpen}
          setOpen={setReportDialogOpen}
          title={reportDialogContent?.titleKey}
        >
          {reportDialogContent ? t(reportDialogContent.messageKey) : ""}
        </CommonDialog>
      </>
    );
  }

  return (
    <Alert severity="warning" variant="outlined" className="rounded-xl">
      <div className="mb-3 font-bold">{t("noTrainDataTitleMsg")}</div>
      <ul className="list-inside list-disc">
        <li>{t("noTrainInThisTimeMsg")}</li>
        {/* 台鐵有「轉乘」模式可引導；高鐵/桃捷無 transfer，維持「兩站間無停靠列車」 */}
        {isTr ? (
          <li>{t("noTrainDataTryTransferMsg")}</li>
        ) : (
          <li>{t("noTrainStopBetweenStationsMsg")}</li>
        )}
      </ul>
    </Alert>
  );
};

export default NoTrainData;
