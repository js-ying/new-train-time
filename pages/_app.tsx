import { appWithTranslation, useTranslation } from "next-i18next";
import { ThemeProvider } from "next-themes";
import { AppProps } from "next/app";
import { SearchAreaProvider } from "../contexts/SearchAreaContext";

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
        <title>{`${t(page)}${t("title")}`}</title>
      </Head>
      <ThemeProvider attribute="class">
        <SearchAreaProvider>
          <Component {...pageProps} />
        </SearchAreaProvider>
      </ThemeProvider>
    </>
  );
}

export default appWithTranslation(App);
