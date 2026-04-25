import Head from "next/head";
import { NextPageContext } from "next";
import { useRouter } from "next/router";

interface ErrorPageProps {
  statusCode?: number;
}

/**
 * Next.js 原生錯誤頁（404 / 500 等）。
 * _error.tsx 不能用 getStaticProps / getServerSideProps，i18n bundle 在這條路徑
 * 無法可靠載入；訊息直接以 router.locale 切中英雙語，避開 i18n。
 */
const ErrorPage = ({ statusCode }: ErrorPageProps) => {
  const router = useRouter();
  const isZh = (router.locale ?? "").startsWith("zh");

  const headline =
    statusCode === 404
      ? "404 Not Found"
      : `${statusCode || ""} Sorry, something went wrong.`;
  const siteName = isZh ? "台鐵時刻查詢" : "Taiwan Railway Timetable";
  const titleTag = isZh ? "錯誤頁面 - 台鐵時刻查詢" : "Error - Taiwan Railway Timetable";

  return (
    <>
      <Head>
        <title>{titleTag}</title>
      </Head>
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-2xl font-bold">{headline}</div>
          <div className="text-muted-foreground">
            <div>{siteName}</div>
            <div className="text-sm">https://traintime.jsy.tw</div>
          </div>
        </div>
      </div>
    </>
  );
};

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res?.statusCode ?? err?.statusCode ?? 404;
  return { statusCode };
};

export default ErrorPage;
