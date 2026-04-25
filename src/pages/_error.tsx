import { Button } from "@heroui/react";
import { useTranslation } from "next-i18next";
import Head from "next/head";
import Link from "next/link";

interface ErrorPageProps {
  statusCode?: number;
}

/**
 * Next.js 原生錯誤頁（404 / 500 等）。
 *
 * 注意：Next.js 不允許 _error.tsx 使用 getStaticProps / getServerSideProps，
 * 因此這裡只能依賴 _app 內已透過 appWithTranslation 載入的 i18n bundle；
 * 若 i18n key 尚未就緒（極端例子如 cold SSR）則 fallback 到內建中英雙語訊息。
 */
const ErrorPage = ({ statusCode }: ErrorPageProps) => {
  const { t, i18n } = useTranslation();
  const isNotFound = statusCode === 404;
  const titleKey = isNotFound ? "errorPage404Title" : "errorFallbackTitle";
  const descKey = isNotFound
    ? "errorPage404Description"
    : "errorFallbackDescription";

  // i18n 尚未 hydrate 完成時回退到內建訊息，避免顯示原始 key
  const fallback = (zh: string, en: string) =>
    i18n.language?.startsWith("zh") ? zh : en;
  const title = i18n.exists(titleKey)
    ? t(titleKey)
    : isNotFound
      ? fallback("找不到頁面", "Page not found")
      : fallback("畫面載入時發生問題", "Something went wrong");
  const description = i18n.exists(descKey)
    ? t(descKey)
    : isNotFound
      ? fallback("您要查詢的頁面不存在或已被移除。", "The page does not exist.")
      : fallback("請重新整理頁面。", "Please refresh the page.");
  const backLabel = i18n.exists("backToHomeBtn")
    ? t("backToHomeBtn")
    : fallback("回首頁", "Back to home");

  return (
    <>
      <Head>
        <title>{`${title} - Traintime`}</title>
      </Head>
      <div className="flex min-h-screen w-full items-center justify-center px-6">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <div className="text-3xl font-bold">{statusCode ?? ""}</div>
          <div className="text-xl font-semibold">{title}</div>
          <div className="text-sm text-muted-foreground">{description}</div>
          <Button as={Link} href="/" color="primary" variant="solid">
            {backLabel}
          </Button>
        </div>
      </div>
    </>
  );
};

ErrorPage.getInitialProps = ({ res, err }: any) => {
  const statusCode = res?.statusCode ?? err?.statusCode ?? 404;
  return { statusCode };
};

export default ErrorPage;
