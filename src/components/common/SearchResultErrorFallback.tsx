import { Button } from "@heroui/react";
import Alert from "@mui/material/Alert";
import { useTranslation } from "next-i18next";
import { FC } from "react";

interface SearchResultErrorFallbackProps {
  /** react-error-boundary 注入：呈現 fallback 的原始錯誤；只在 dev console 印出 */
  error?: unknown;
  /** react-error-boundary 注入：點重試時呼叫，搭配 resetKeys 達成自動恢復 */
  resetErrorBoundary?: () => void;
}

/**
 * 搜尋結果區塊級 Error Boundary 的 fallback：
 * 不洗掉整頁，只把表格區換成紅色 Alert + 重試按鈕；SearchArea / Sidebar 仍可操作
 */
const SearchResultErrorFallback: FC<SearchResultErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  const { t } = useTranslation();

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.error("[SearchResultErrorFallback]", error);
  }

  return (
    <Alert severity="error" variant="outlined" className="rounded-xl">
      <div className="flex flex-col gap-2">
        <div className="font-bold">{t("errorFallbackTitle")}</div>
        <div className="text-sm">{t("errorFallbackDescription")}</div>
        {resetErrorBoundary && (
          <div>
            <Button
              size="sm"
              color="primary"
              variant="flat"
              onPress={resetErrorBoundary}
            >
              {t("retryBtn")}
            </Button>
          </div>
        )}
      </div>
    </Alert>
  );
};

export default SearchResultErrorFallback;
