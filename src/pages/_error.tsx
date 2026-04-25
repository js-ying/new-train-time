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
 * 因此 i18n bundle 不一定完整載入。語言判斷走 next/router 的 `locale`，
 * 不能用 i18n.language——後者在 _error 路徑會穩定回 default locale。
 */
const ErrorPage = ({ statusCode }: ErrorPageProps) => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const isNotFound = statusCode === 404;
  const titleKey = isNotFound ? "errorPage404Title" : "errorFallbackTitle";
  const descKey = isNotFound
    ? "errorPage404Description"
    : "errorFallbackDescription";

  const isZh = (router.locale ?? "").startsWith("zh");
  const i18nReady = typeof i18n?.exists === "function";
  const title = i18nReady && i18n.exists(titleKey) ? t(titleKey) : "";
  const description = i18nReady && i18n.exists(descKey) ? t(descKey) : "";
  const backLabel =
    i18nReady && i18n.exists("backToHomeBtn")
      ? t("backToHomeBtn")
      : isZh
        ? "回首頁"
        : "Back to home";

  return (
    <>
      <Head>
        <title>{`${title || (isZh ? "錯誤" : "Error")} - 台鐵時刻查詢`}</title>
      </Head>
      <div className="flex min-h-screen w-full items-center justify-center px-6">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <div className="text-3xl font-bold">{statusCode ?? ""}</div>
          {title && <div className="text-xl font-semibold">{title}</div>}
          {description && (
            <div className="text-muted-foreground text-sm">{description}</div>
          )}
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
