import Alert from "@mui/material/Alert";
import { useTranslation } from "next-i18next";
import { FC } from "react";

interface SearchResultErrorFallbackProps {
  /** react-error-boundary 注入：呈現 fallback 的原始錯誤；只在 dev console 印出 */
  error?: unknown;
}

/**
 * 搜尋結果區塊級 Error Boundary 的 fallback：
 * 不洗掉整頁，只把表格區換成紅色 Alert；SearchArea / Sidebar 仍可操作。
 * 元件層不放重試按鈕——使用者重新搜尋時 ErrorBoundary 的 resetKeys
 * （jsy*Info refs 變化）會自動 reset。
 */
const SearchResultErrorFallback: FC<SearchResultErrorFallbackProps> = ({
  error,
}) => {
  const { t } = useTranslation();

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.error("[SearchResultErrorFallback]", error);
  }

  return (
    <Alert severity="error" variant="outlined" className="rounded-xl">
      <div className="font-bold">{t("errorFallbackTitle")}</div>
      <div className="text-sm">{t("errorFallbackDescription")}</div>
    </Alert>
  );
};

export default SearchResultErrorFallback;
