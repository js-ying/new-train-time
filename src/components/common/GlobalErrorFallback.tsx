import { Button } from "@heroui/react";
import { useTranslation } from "next-i18next";
import { FC } from "react";

interface GlobalErrorFallbackProps {
  /** react-error-boundary 注入的錯誤物件；目前僅在 dev console 印出供除錯 */
  error?: unknown;
  /** react-error-boundary 注入的 reset 函式；按下重新整理時呼叫 */
  resetErrorBoundary?: () => void;
}

/**
 * 全域 Error Boundary 的 fallback 畫面：
 * - 元件 render 期未捕捉例外時呈現
 * - 提供「重新整理」按鈕，呼叫 react-error-boundary 的 reset，並 reload window
 *   以保證即便 SSR/CSR state 已壞也能恢復
 */
const GlobalErrorFallback: FC<GlobalErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  const { t } = useTranslation();

  if (process.env.NODE_ENV !== "production") {
    // 開發階段把錯誤印到 console，方便定位 stack
    // eslint-disable-next-line no-console
    console.error("[GlobalErrorFallback]", error);
  }

  const handleReload = () => {
    resetErrorBoundary?.();
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-6">
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
        <div className="text-2xl font-bold">{t("errorFallbackTitle")}</div>
        <div className="text-sm text-muted-foreground">
          {t("errorFallbackDescription")}
        </div>
        <Button color="primary" variant="solid" onPress={handleReload}>
          {t("reloadBtn")}
        </Button>
      </div>
    </div>
  );
};

export default GlobalErrorFallback;
