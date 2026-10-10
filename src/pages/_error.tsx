import Head from "next/head";
import { NextPageContext } from "next";
import { useRouter } from "next/router";

interface ErrorPageProps {
  statusCode?: number;
}

/** 各語系的站名與錯誤頁標題 */
const ERROR_COPY: Record<string, { siteName: string; error: string }> = {
  "zh-TW": { siteName: "台鐵時刻查詢", error: "錯誤頁面" },
  en: { siteName: "Taiwan Railway Timetable", error: "Error" },
  ja: { siteName: "台鉄 時刻表検索", error: "エラー" },
  ko: { siteName: "대만철도 시간표 조회", error: "오류" },
};

/**
 * Next.js 原生錯誤頁（404 / 500 等）。
 * _error.tsx 不能用 getStaticProps / getServerSideProps，i18n bundle 在這條路徑
 * 無法可靠載入；訊息直接以 router.locale 查常數表，避開 i18n。
 */
const ErrorPage = ({ statusCode }: ErrorPageProps) => {
  const router = useRouter();
  const copy = ERROR_COPY[router.locale ?? ""] ?? ERROR_COPY.en;

  const headline =
    statusCode === 404
      ? "404 Not Found"
      : `${statusCode || ""} Sorry, something went wrong.`;
  const siteName = copy.siteName;
  const titleTag = `${copy.error} - ${copy.siteName}`;

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
