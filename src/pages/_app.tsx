import GlobalErrorFallback from "@/components/common/GlobalErrorFallback";
import LocaleSuggestionDialog from "@/components/common/LocaleSuggestionDialog";
import AppMeta from "@/components/layout/AppMeta";
import GoogleScript from "@/components/layout/GoogleScript";
import { defaultSeoConfig } from "@/configs/seoConfig";
import { AuthProvider } from "@/contexts/AuthContext";
import { PwaProvider } from "@/contexts/PwaContext";
import { SearchAreaProvider } from "@/contexts/SearchAreaContext";
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
      <PwaProvider>
        <HeroUIProvider>
          <NextThemesProvider attribute="class">
            <AuthProvider>
              <SettingProvider>
                <SearchAreaProvider>
                  <DefaultSeo {...defaultSeoConfig} />
                  <AppMeta />
                  {/* 全域 Error Boundary：保底承接元件 render 期未捕捉例外 */}
                  <ErrorBoundary FallbackComponent={GlobalErrorFallback}>
                    <Component {...pageProps} />
                  </ErrorBoundary>
                  <LocaleSuggestionDialog />
                </SearchAreaProvider>
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
