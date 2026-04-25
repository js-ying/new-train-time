import useApiError from "@/hooks/useApiError";
import { ApiError } from "@/models/problem-details";
import DateUtils from "@/utils/DateUtils";
import Alert from "@mui/material/Alert";
import { Button } from "@heroui/react";
import { useTranslation } from "next-i18next";
import { FC, ReactNode } from "react";
import { LocaleEnum } from "../../enums/LocaleEnum";

interface DataStateProps {
  /** 是否處於空資料狀態（例如查詢成功但 timeTables 為空） */
  isEmpty: boolean;
  /** API 錯誤；非 null 即顯示 Error 形態 */
  error: ApiError | null;
  /** 重試按鈕回呼；為 undefined 時即使 retryable 也不顯示按鈕 */
  onRetry?: () => void;
  /** 自訂 Empty 形態的內容（例如「時段太晚 / 兩站無停靠」說明） */
  emptyContent?: ReactNode;
  /** Empty 標題；預設讀取 i18n `noTrainDataTitleMsg` */
  emptyTitleKey?: string;
  /** Error 形態下若該 ApiError code 沒有 i18n key 時 fallback 用的訊息 key */
  fallbackErrorMessageKey?: string;
  /** 有資料時要呈現的子節點（避免 search.tsx 多包一層條件渲染） */
  children?: ReactNode;
}

/**
 * Loading / Empty / Error 三態切換器（Loading 由上游覆蓋整頁處理，這裡只管 Empty / Error / Data 三態）。
 *
 * - Empty：黃色 Alert，顯示時段無車或兩站無班次的說明
 * - Error：紅色 Alert，依 useApiError 顯示對應 i18n 訊息；retryable 時附「重試」按鈕
 * - Data：直接渲染 children
 */
const DataState: FC<DataStateProps> = ({
  isEmpty,
  error,
  onRetry,
  emptyContent,
  emptyTitleKey = "noTrainDataTitleMsg",
  fallbackErrorMessageKey = "noTrainDataDueToApiErrorMsg",
  children,
}) => {
  const { t, i18n } = useTranslation();
  const view = useApiError(error);

  if (view.error) {
    // 未知 / fullpage / modal 等其他 kind 在搜尋區也以紅 Alert 占位顯示，
    // 由上層 ErrorBoundary 或 Dialog 自行決定是否再加額外處理
    // i18n key 不存在時 fallback 到泛用「系統異常」訊息
    const messageText = i18n.exists(view.messageKey)
      ? t(view.messageKey)
      : t(fallbackErrorMessageKey);
    const trailingSpace = i18n.language === LocaleEnum.TW ? "" : " ";

    return (
      <Alert severity="error" variant="outlined" className="rounded-xl">
        <div className="flex flex-col gap-2">
          <div className="font-bold">
            {messageText}
            {trailingSpace}
            {`(${DateUtils.getCurrentDatetime()})`}
          </div>
          {view.retryable && onRetry && (
            <div>
              <Button
                size="sm"
                color="primary"
                variant="flat"
                onPress={onRetry}
              >
                {t("retryBtn")}
              </Button>
            </div>
          )}
        </div>
      </Alert>
    );
  }

  if (isEmpty) {
    return (
      <Alert severity="warning" variant="outlined" className="rounded-xl">
        <div className="mb-3 font-bold">{t(emptyTitleKey)}</div>
        {emptyContent ?? (
          <div>
            <li>{t("noTrainInThisTimeMsg")}</li>
            <li>{t("noTrainStopBetweenStationsMsg")}</li>
          </div>
        )}
      </Alert>
    );
  }

  return <>{children}</>;
};

export default DataState;
