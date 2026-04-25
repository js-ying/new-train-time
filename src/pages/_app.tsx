import GlobalErrorFallback from "@/components/common/GlobalErrorFallback";
import LocaleSuggestionDialog from "@/components/common/LocaleSuggestionDialog";
import GoogleScript from "@/components/layout/GoogleScript";
import PageHead from "@/components/layout/PageHead";
import { AuthProvider } from "@/contexts/AuthContext";
import { PwaProvider } from "@/contexts/PwaContext";
import { SearchAreaProvider } from "@/contexts/SearchAreaContext";
import { SettingProvider } from "@/contexts/SettingContext";
import useAutoRedirectLastUsedPage from "@/hooks/useAutoRedirectLastUsedPage";
import { useTrackBrowseSource } from "@/hooks/useTrackBrowseSource";
import "@/styles/global.scss";
import { HeroUIProvider } from "@heroui/react";
import { appWithTranslation } from "next-i18next";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AppProps } from "next/app";
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
                  <PageHead />
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

export default appWithTranslation(App);
