import { appWithTranslation, useTranslation } from "next-i18next";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AppProps } from "next/app";
import { SearchAreaProvider } from "../contexts/SearchAreaContext";

import { NextUIProvider } from "@nextui-org/react";
import Head from "next/head";
import usePage from "../hooks/usePageHook";
import "../styles/global.scss";

function App({ Component, pageProps }: AppProps) {
  const { t } = useTranslation();
  const { page } = usePage();

  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/images/logo.png" />
        <title>{`${t(page + "Title")}｜${t("subTitle")}`}</title>
        <meta name="description" content={t("webDescription")}></meta>
      </Head>
      <NextUIProvider>
        <NextThemesProvider attribute="class">
          <SearchAreaProvider>
            <Component {...pageProps} />
          </SearchAreaProvider>
        </NextThemesProvider>
      </NextUIProvider>
    </>
  );
}

export default appWithTranslation(App);
