import Head from "next/head";
import ThemeSwitch from "./ThemeSwitch";
import { LayoutParams } from "./interfaces/Layout";

export default function Layout({
  children,
  setActiveIndex,
  title = "",
}: LayoutParams) {
  return (
    <>
      <Head>
        <title>台鐵時刻查詢</title>
        <body className={`dark:bg-grayBlack`} />
      </Head>
      <div className="max-w-6xl mx-auto p-6">
        <div className="relative mb-6">
          <h1 className="text-center">
            <span
              className="cursor-pointer"
              onClick={() => setActiveIndex(null)}
            >
              {title}
            </span>
          </h1>
          <div className="absolute top-0.5 right-0">
            <ThemeSwitch />
          </div>
        </div>
        {children}
      </div>
    </>
  );
}
