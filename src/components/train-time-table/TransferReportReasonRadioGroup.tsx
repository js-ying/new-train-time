import { ReportTransferReason } from "@/services/reportService";
import { Radio, RadioGroup } from "@heroui/react";
import { useTranslation } from "next-i18next";
import { FC } from "react";

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

/** 預設選取的回報原因；缺值情境一律對齊此值 */
export const DEFAULT_REPORT_REASON: ReportTransferReason = "missing";

interface TransferReportReasonRadioGroupProps {
  /** 目前選取的問題類型 */
  value: ReportTransferReason;
  /** 選取變更回調 */
  onChange: (reason: ReportTransferReason) => void;
}

/**
 * 轉乘錯誤回報的「問題類型」單選群組（共用元件）。
 * 由 NoTrainData（無資料路徑）與 TrTransferDescription（轉乘說明路徑）共用，
 * 避免選項清單在兩處各寫一份而漏同步。
 */
const TransferReportReasonRadioGroup: FC<
  TransferReportReasonRadioGroupProps
> = ({ value, onChange }) => {
  const { t } = useTranslation();
  return (
    <RadioGroup
      value={value}
      onValueChange={(v) => onChange(v as ReportTransferReason)}
      aria-label={t("reportReasonGroupAriaLabel")}
    >
      {REPORT_REASON_OPTIONS.map((opt) => (
        <Radio key={opt.value} value={opt.value}>
          {t(opt.labelKey)}
        </Radio>
      ))}
    </RadioGroup>
  );
};

export default TransferReportReasonRadioGroup;
