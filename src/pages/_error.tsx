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

  // i18n 尚未 hydrate 完成（或 _error 路徑未經 appWithTranslation 包裝）時，
  // 回退到內建雙語訊息，避免顯示原始 key
  const isZh = (i18n?.language ?? "").startsWith("zh");
  const fallback = (zh: string, en: string) => (isZh ? zh : en);
  const tryTranslate = (key: string, zh: string, en: string) => {
    if (typeof i18n?.exists === "function" && i18n.exists(key)) return t(key);
    return fallback(zh, en);
  };
  const title = isNotFound
    ? tryTranslate(titleKey, "找不到頁面", "Page not found")
    : tryTranslate(titleKey, "畫面載入時發生問題", "Something went wrong");
  const description = isNotFound
    ? tryTranslate(
        descKey,
        "您要查詢的頁面不存在或已被移除。",
        "The page does not exist.",
      )
    : tryTranslate(descKey, "請重新整理頁面。", "Please refresh the page.");
  const backLabel = tryTranslate("backToHomeBtn", "回首頁", "Back to home");

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
