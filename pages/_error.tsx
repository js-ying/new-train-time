import Head from "next/head";

const Error = ({ statusCode }) => {
  return (
    <>
      <Head>
        <title>{"錯誤頁面 - 台鐵時刻查詢"}</title>
      </Head>
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-2xl font-bold">
            {statusCode === 404
              ? `404 Not Found`
              : `${statusCode || ""} Sorry, something went wrong.`}
          </div>
          <div className="text-zinc-500 dark:text-zinc-400">
            <div>台鐵時刻查詢</div>
            <div className="text-sm">https://traintime.jsy.tw</div>
          </div>
        </div>
      </div>
    </>
  );
};

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
