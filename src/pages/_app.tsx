import GlobalErrorFallback from "@/components/common/GlobalErrorFallback";
import LocaleSuggestionDialog from "@/components/common/LocaleSuggestionDialog";
import AppMeta from "@/components/layout/AppMeta";
import GoogleScript from "@/components/layout/GoogleScript";
import { appSans } from "@/configs/fonts";
import { defaultSeoConfig } from "@/configs/seoConfig";
import { AuthProvider } from "@/contexts/AuthContext";
import { PwaProvider } from "@/contexts/PwaContext";
import { SearchAreaProvider } from "@/contexts/SearchAreaContext";
import { SearchHistoryProvider } from "@/contexts/SearchHistoryContext";
import { SearchModeProvider } from "@/contexts/SearchModeContext";
import { SettingProvider } from "@/contexts/SettingContext";
import useAutoRedirectLastUsedPage from "@/hooks/useAutoRedirectLastUsedPage";
import { useTrackBrowseSource } from "@/hooks/useTrackBrowseSource";
import "@/styles/global.scss";
import { HeroUIProvider } from "@heroui/react";
import { sendGAEvent } from "@next/third-parties/google";
import { appWithTranslation } from "next-i18next";
import { DefaultSeo } from "next-seo";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AppProps, NextWebVitalsMetric } from "next/app";
import { ErrorBoundary } from "react-error-boundary";

function App({ Component, pageProps }: AppProps) {
  useTrackBrowseSource();
  useAutoRedirectLastUsedPage();

  return (
    <>
      {/*
        全站字體單一來源：把 next/font 產生的（雜湊）font-family 註冊成 CSS 變數，
        放在 :root 讓 body（global.scss）與 MUI（含 portal 到 body 的 Dialog /
        日期選擇器）都能取用。import appSans 即會注入對應 @font-face。
      */}
      <style jsx global>{`
        :root {
          --font-app-sans: ${appSans.style.fontFamily};
        }
      `}</style>
      <PwaProvider>
        <HeroUIProvider>
          <NextThemesProvider attribute="class">
            <AuthProvider>
              <SettingProvider>
                <SearchHistoryProvider>
                  <SearchAreaProvider>
                    <SearchModeProvider>
                      <DefaultSeo {...defaultSeoConfig} />
                      <AppMeta />
                      {/* 全域 Error Boundary：保底承接元件 render 期未捕捉例外 */}
                      <ErrorBoundary FallbackComponent={GlobalErrorFallback}>
                        <Component {...pageProps} />
                      </ErrorBoundary>
                      <LocaleSuggestionDialog />
                    </SearchModeProvider>
                  </SearchAreaProvider>
                </SearchHistoryProvider>
              </SettingProvider>
            </AuthProvider>
          </NextThemesProvider>
        </HeroUIProvider>
      </PwaProvider>
      <GoogleScript />
    </>
  );
}

/**
 * Core Web Vitals 上報 GA4。
 * Next.js 會把 INP / LCP / CLS / FCP / TTFB 等 metric 自動回呼到此函式，
 * 透過 @next/third-parties 的 gtag 介面送出 web_vitals 事件。
 */
export function reportWebVitals(metric: NextWebVitalsMetric) {
  sendGAEvent("event", metric.name, {
    value: Math.round(
      metric.name === "CLS" ? metric.value * 1000 : metric.value,
    ),
    metric_id: metric.id,
    metric_value: metric.value,
    metric_label: metric.label,
  });
}

export default appWithTranslation(App);
