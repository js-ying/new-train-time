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
                  <Component {...pageProps} />
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
