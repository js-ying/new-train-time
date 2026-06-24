import CommonDialog from "@/components/common/CommonDialog";
import { ApiError } from "@/models/problem-details";
import {
  postTransferReport,
  ReportTrainType,
  ReportTransferReason,
} from "@/services/reportService";
import DateUtils from "@/utils/DateUtils";
import { Button } from "@heroui/react";
import Alert from "@mui/material/Alert";
import { useTranslation } from "next-i18next";
import { FC, useEffect, useMemo, useState } from "react";
import { LocaleEnum } from "../../enums/LocaleEnum";
import TransferReportReasonRadioGroup, {
  DEFAULT_REPORT_REASON,
} from "./TransferReportReasonRadioGroup";

interface NoTrainDataProps {
  /** 來自 useTrainSearch 的 API 錯誤；非 null 即顯示紅 Alert（isStation/isTransfer 模式可省略） */
  apiError?: ApiError | null;
  /** 是否為轉乘模式無資料；切換 Alert 文案（含「可能不需轉乘」常見原因） */
  isTransfer?: boolean;
  /** 轉乘無資料但該區間有直達車：改顯示「建議切換直達查詢」引導（取代泛用原因） */
  hasDirect?: boolean;
  /** 是否為台鐵（TR）；direct 模式無資料時用以追加「改試轉乘」引導 */
  isTr?: boolean;
  /** 單站發車看板無資料（今日班次已發完）：顯示簡潔黃 Alert，無轉乘/起迄站字樣 */
  isStation?: boolean;
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
  hasDirect,
  isTr,
  isStation,
  reportPayload,
}) => {
  const { t, i18n } = useTranslation();

  // 錯誤回報狀態：reported 用於同次查詢避免重覆送出；查詢條件變動即 reset
  const [isReporting, setIsReporting] = useState(false);
  const [hasReported, setHasReported] = useState(false);
  // 送出前的二次確認 dialog；確認後才真的打 API
  const [confirmOpen, setConfirmOpen] = useState(false);
  // 使用者於確認 dialog 選擇的問題類型；reset 規則同 hasReported
  const [selectedReason, setSelectedReason] =
    useState<ReportTransferReason>(DEFAULT_REPORT_REASON);
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
    setSelectedReason(DEFAULT_REPORT_REASON);
  }, [reportKey]);

  // 點擊「錯誤回報」按鈕：先開啟確認 dialog，不立即送出
  const handleReportClick = () => {
    if (!reportPayload || isReporting || hasReported) return;
    setConfirmOpen(true);
  };

  // 確認 dialog 點「確認」後才提交，並依結果顯示成功 / 失敗 dialog
  const handleReportConfirm = async () => {
    if (!reportPayload || isReporting || hasReported) return;
    setIsReporting(true);
    try {
      await postTransferReport({ ...reportPayload, reason: selectedReason });
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

  // 單站發車看板：今日班次已發完（不需轉乘 / 起迄站字樣，只提示時間太晚）
  if (isStation) {
    return (
      <Alert severity="warning" variant="outlined" className="rounded-xl">
        <div className="font-bold">{t("trStationBoardNoMoreTrains")}</div>
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
            {/* 該區間有直達車：以「建議改用直達查詢」取代泛用原因（避免使用者誤判系統壞掉而回報） */}
            {hasDirect ? (
              <li>{t("hasDirectTrainMsg")}</li>
            ) : (
              <>
                <li>{t("noTransferInThisTimeMsg")}</li>
                <li>{t("noSuitableTransferRouteMsg")}</li>
              </>
            )}
            {/* 第三點：prefix 文字一律以 li 呈現（與前兩點對齊）；按鈕僅 PC 接在文字後 */}
            {canReport && (
              <li>
                {t("reportTransferIssuePrefix")}
                <Button
                  size="sm"
                  color="primary"
                  isLoading={isReporting}
                  isDisabled={hasReported || isReporting}
                  onPress={handleReportClick}
                  className="hidden h-auto min-h-fit min-w-fit bg-silverLakeBlue-500 px-2 py-1 text-xs text-white dark:bg-gamboge-500 dark:text-eerieBlack-500 md:inline-flex"
                >
                  {hasReported
                    ? t("reportTransferIssueBtnDone")
                    : t("reportIssueBtn")}
                </Button>
              </li>
            )}
          </ul>
          {/* 手機版：按鈕另起一行置中，prefix 文字已在上方 li 內。
              justify-center 只置中於 message 區（icon 右側），中心比整張卡片偏右；
              -translate-x 左移 icon 欄寬一半（icon 22 + marginRight 12 = 34 ⇒ 17px）對齊卡片中心 */}
          {canReport && (
            <div className="mt-2 flex -translate-x-[17px] justify-center md:hidden">
              <Button
                size="sm"
                color="primary"
                isLoading={isReporting}
                isDisabled={hasReported || isReporting}
                onPress={handleReportClick}
                className="h-auto min-h-fit min-w-fit bg-silverLakeBlue-500 px-2 py-1 text-xs text-white dark:bg-gamboge-500 dark:text-eerieBlack-500"
              >
                {hasReported
                  ? t("reportTransferIssueBtnDone")
                  : t("reportIssueBtn")}
              </Button>
            </div>
          )}
        </Alert>

        {/* 送出前的二次確認 dialog；點「確認」才真的呼叫 API
            內嵌 radio group 讓 user 選問題類型（預設 missing），餵 user_transfer_reports 表分類聚合 */}
        <CommonDialog
          open={confirmOpen}
          setOpen={setConfirmOpen}
          title="reportConfirmTitle"
          confirmText="confirm"
          cancelText="cancel"
          onConfirm={handleReportConfirm}
          bodyTextAlign="text-left"
        >
          <div className="flex flex-col gap-3">
            <div>{t("reportConfirmMsg")}</div>
            <TransferReportReasonRadioGroup
              value={selectedReason}
              onChange={setSelectedReason}
            />
          </div>
        </CommonDialog>

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
