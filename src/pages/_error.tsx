import { Button } from "@heroui/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

interface ErrorPageProps {
  statusCode?: number;
}

/**
 * Next.js 原生錯誤頁（404 / 500 等）。
 *
 * 注意：_error.tsx 不能用 getStaticProps / getServerSideProps，i18n bundle
 * 在這條路徑無法可靠載入；訊息直接以 router.locale 切中英雙語，避開 i18n。
 */
const ErrorPage = ({ statusCode }: ErrorPageProps) => {
  const router = useRouter();
  const isNotFound = statusCode === 404;
  const isZh = (router.locale ?? "").startsWith("zh");

  const title = isNotFound
    ? isZh
      ? "找不到頁面"
      : "Page not found"
    : isZh
      ? "畫面載入時發生問題"
      : "Something went wrong";
  const description = isNotFound
    ? isZh
      ? "您要查詢的頁面不存在或已被移除，請返回首頁重新查詢。"
      : "The page you are looking for does not exist or has been removed."
    : isZh
      ? "請重新整理頁面，若問題持續發生請通知系統管理員。"
      : "Please refresh the page. If the issue persists, contact the administrator.";
  const backLabel = isZh ? "回首頁" : "Back to home";
  const siteName = isZh ? "台鐵時刻查詢" : "Traintime";

  return (
    <>
      <Head>
        <title>{`${title} - ${siteName}`}</title>
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
