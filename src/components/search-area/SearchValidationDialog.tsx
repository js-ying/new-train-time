import { ValidationAlert } from "@/hooks/useParamsValidation";
import { useTranslation } from "next-i18next";
import { FC } from "react";
import CommonDialog from "../common/CommonDialog";

interface SearchValidationDialogProps {
  validationAlert: ValidationAlert;
  sameQuerySeconds: number;
}

/** 送出搜尋的檢核提示；日期錯誤不在此顯示，直接導頁由 search 頁面處理 */
const SearchValidationDialog: FC<SearchValidationDialogProps> = ({
  validationAlert,
  sameQuerySeconds,
}) => {
  const { t } = useTranslation();

  return (
    <CommonDialog
      open={
        validationAlert.open &&
        validationAlert.message !== "datetimeNotAllowMsg"
      }
      setOpen={validationAlert.setOpen}
    >
      {validationAlert.message === "sameQueryMsg"
        ? t("sameQueryCountdownMsg", { seconds: sameQuerySeconds })
        : t(validationAlert.message)}
    </CommonDialog>
  );
};

export default SearchValidationDialog;
