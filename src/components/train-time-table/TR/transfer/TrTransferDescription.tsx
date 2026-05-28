import CommonDialog from "@/components/common/CommonDialog";
import { ApiError } from "@/models/problem-details";
import {
  postTransferReport,
  ReportTrainType,
  ReportTransferReason,
} from "@/services/reportService";
import { Button, Radio, RadioGroup } from "@heroui/react";
import { useTranslation } from "next-i18next";
import { FC, useEffect, useMemo, useState } from "react";

/** 回報原因選項；順序 = UI 顯示順序，預設選第一項 (missing) */
const REPORT_REASON_OPTIONS: Array<{
  value: ReportTransferReason;
  labelKey: string;
}> = [
  { value: "missing", labelKey: "reportReasonMissing" },
  { value: "extra", labelKey: "reportReasonExtra" },
  { value: "hub", labelKey: "reportReasonHub" },
  { value: "other", labelKey: "reportReasonOther" },
];

const DEFAULT_REASON: ReportTransferReason = "missing";

interface TrTransferDescriptionProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  /** 當前查詢條件；提供完整即啟用內嵌「錯誤回報」按鈕 */
  reportPayload?: {
    trainType: ReportTrainType;
    startStationId: string;
    endStationId: string;
    date: string;
  };
}

/**
 * 台鐵轉乘說明 Dialog（Beta 期間使用，向使用者揭露資料涵蓋限制與回饋管道）
 * 同時嵌入「我確定有轉乘方案」錯誤回報入口，覆蓋「有轉乘結果但仍漏列」情境。
 */
const TrTransferDescription: FC<TrTransferDescriptionProps> = ({
  open,
  setOpen,
  reportPayload,
}) => {
  const { t, i18n } = useTranslation();
  // i18n 以陣列回傳多段公告，逐段渲染保留段落空白
  const paragraphs = t("announcementTrTransferV1", {
    returnObjects: true,
  }) as string[];

  // 錯誤回報狀態：同次查詢內回報後 disable；查詢條件變動即 reset
  const [isReporting, setIsReporting] = useState(false);
  const [hasReported, setHasReported] = useState(false);
  // 提交前確認 dialog；確認後才真的打 API，避免誤觸
  const [confirmOpen, setConfirmOpen] = useState(false);
  // 使用者於確認 dialog 選擇的問題類型；reset 規則同 hasReported
  const [selectedReason, setSelectedReason] =
    useState<ReportTransferReason>(DEFAULT_REASON);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportDialogContent, setReportDialogContent] = useState<{
    titleKey: string;
    messageKey: string;
  } | null>(null);

  const reportKey = useMemo(() => {
    if (!reportPayload) return "";
    const { trainType, startStationId, endStationId, date } = reportPayload;
    return `${trainType}|${startStationId}|${endStationId}|${date}`;
  }, [reportPayload]);

  useEffect(() => {
    setHasReported(false);
    setSelectedReason(DEFAULT_REASON);
  }, [reportKey]);

  // 點擊「錯誤回報」：僅開啟確認 dialog，不立即送出
  const handleReportClick = () => {
    if (!reportPayload || isReporting || hasReported) return;
    setConfirmOpen(true);
  };

  // 使用者於確認 dialog 點「確認」後才執行 API 提交
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

  const canReport = !!reportPayload;

  return (
    <>
      <CommonDialog
        open={open}
        setOpen={setOpen}
        title="trTransferDescription"
        bodyTextAlign="text-left"
        size="md"
      >
        <div className="flex flex-col gap-4">
          {paragraphs.map((text, index) => (
            <p key={index}>{text}</p>
          ))}
          {canReport && (
            <div className="mt-3 flex justify-center">
              <Button
                color="primary"
                isLoading={isReporting}
                isDisabled={hasReported || isReporting}
                onPress={handleReportClick}
                className="w-fit bg-silverLakeBlue-500 text-white dark:bg-gamboge-500 dark:text-eerieBlack-500"
              >
                {hasReported
                  ? t("reportTransferIssueBtnDone")
                  : t("reportIssueBtn")}
              </Button>
            </div>
          )}
        </div>
      </CommonDialog>

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
          <RadioGroup
            value={selectedReason}
            onValueChange={(v) =>
              setSelectedReason(v as ReportTransferReason)
            }
            aria-label={t("reportReasonGroupAriaLabel")}
          >
            {REPORT_REASON_OPTIONS.map((opt) => (
              <Radio key={opt.value} value={opt.value}>
                {t(opt.labelKey)}
              </Radio>
            ))}
          </RadioGroup>
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
};

export default TrTransferDescription;
