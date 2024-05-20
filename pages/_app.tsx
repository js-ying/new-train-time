import { appWithTranslation, useTranslation } from "next-i18next";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { AppProps } from "next/app";
import { SearchAreaProvider } from "../contexts/SearchAreaContext";

import { NextUIProvider } from "@nextui-org/react";
import Head from "next/head";
import GoogleScript from "../components/GoogleScript";
import useLang from "../hooks/useLangHook";
import usePage from "../hooks/usePageHook";
import "../styles/global.scss";

function App({ Component, pageProps }: AppProps) {
  const { t } = useTranslation();
  const { isTw } = useLang();
  const { page } = usePage();
  const { theme } = useTheme();

  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/images/logos/logo-32.png" />
        <title>{`${t(page + "Title")}｜${t("subTitle")}`}</title>
        <meta name="description" content={t("webDescription")}></meta>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${t(page + "Title")}`} />
        <meta property="og:description" content={`${t("subTitle")}`} />
        <meta property="og:site_name" content={`${t(page + "Title")}`} />
        <meta property="og:url" content="https://traintime.jsy.tw" />
        <meta property="og:image" content="/images/logos/logo-192.png" />

        {/* PWA */}
        <link
          rel="manifest"
          href={`${isTw ? "/manifest.json" : "/manifest.en.json"}`}
        />
        <meta
          name="theme-color"
          content={theme === "light" ? "#FFFFFF" : "#212529"}
        />

        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-touch-fullscreen" content="yes" />

        <link rel="apple-touch-icon" href="/images/logos/logo-32.png" />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/images/logos/logo-192.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/images/logos/logo-192.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="167x167"
          href="/images/logos/logo-192.png"
        />
        <link rel="mask-icon" href="/images/logos/logo-32.png" />
      </Head>
      <NextUIProvider>
        <NextThemesProvider attribute="class">
          <SearchAreaProvider>
            <Component {...pageProps} />
          </SearchAreaProvider>
        </NextThemesProvider>
      </NextUIProvider>
      <GoogleScript />
    </>
  );
}

export default appWithTranslation(App);
