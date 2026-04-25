import { Button } from "@heroui/react";
import { useTranslation } from "next-i18next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

interface ErrorPageProps {
  statusCode?: number;
}

/**
 * Next.js 原生錯誤頁（404 / 500 等）。
 *
 * 注意：Next.js 不允許 _error.tsx 使用 getStaticProps / getServerSideProps，
 * 因此 i18n bundle 不一定完整載入（_app 的 appWithTranslation 沒包到這條路徑）。
 *
 * 語言判斷必須走 next/router 的 `locale`（Next.js i18n routing 一定可靠地注入），
 * 不能用 i18n.language——後者在 _error 路徑會穩定回 default locale，導致永遠英文。
 */
const ErrorPage = ({ statusCode }: ErrorPageProps) => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const isNotFound = statusCode === 404;
  const titleKey = isNotFound ? "errorPage404Title" : "errorFallbackTitle";
  const descKey = isNotFound
    ? "errorPage404Description"
    : "errorFallbackDescription";

  // 語言以 router.locale 為準；i18n.exists 不存在時直接走內建雙語 fallback
  const isZh = (router.locale ?? "").startsWith("zh");
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
        <title>{`${title} - 台鐵時刻查詢`}</title>
      </Head>
      <div className="flex min-h-screen w-full items-center justify-center px-6">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <div className="text-3xl font-bold">{statusCode ?? ""}</div>
          <div className="text-xl font-semibold">{title}</div>
          <div className="text-muted-foreground text-sm">{description}</div>
          <Button as={Link} href="/" color="primary" size="sm" variant="solid">
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
