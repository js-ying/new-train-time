import { appWithTranslation, useTranslation } from "next-i18next";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { AppProps } from "next/app";
import { SearchAreaProvider } from "../contexts/SearchAreaContext";

import { HeroUIProvider } from "@heroui/react";
import Head from "next/head";
import GoogleScript from "../components/GoogleScript";
import { PwaProvider } from "../contexts/PwaContext";
import { SettingProvider } from "../contexts/SettingContext";
import useLang from "../hooks/useLangHook";
import "../styles/global.scss";

function App({ Component, pageProps }: AppProps) {
  const { t } = useTranslation();
  const { isTw } = useLang();
  const { theme } = useTheme();

  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/images/logos/logo-32.png" />
        <title>{`${t("trTitle")}`}</title>
        <meta name="description" content={t("webDescription")}></meta>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${t("trTitle")}`} />
        <meta property="og:description" content={`${t("subTitle")}`} />
        <meta property="og:site_name" content={`${t("trTitle")}`} />
        <meta property="og:url" content="https://traintime.jsy.tw" />
        <meta
          property="og:image"
          content="https://jsying1994.s3.amazonaws.com/traintime/logo/og-new-train-time-v2.png"
        />

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
      <PwaProvider>
        <HeroUIProvider>
          <NextThemesProvider attribute="class">
            <SettingProvider>
              <SearchAreaProvider>
                <Component {...pageProps} />
              </SearchAreaProvider>
            </SettingProvider>
          </NextThemesProvider>
        </HeroUIProvider>
      </PwaProvider>
      <GoogleScript />
    </>
  );
}

export default appWithTranslation(App);
