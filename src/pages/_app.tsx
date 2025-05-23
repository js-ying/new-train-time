import GoogleScript from "@/components/GoogleScript";
import { PwaProvider } from "@/contexts/PwaContext";
import { SearchAreaProvider } from "@/contexts/SearchAreaContext";
import { SettingProvider } from "@/contexts/SettingContext";
import { useTrackBrowseSource } from "@/hooks/useTrackBrowseSourceHook";
import "@/styles/global.scss";
import { HeroUIProvider } from "@heroui/react";
import { appWithTranslation } from "next-i18next";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AppProps } from "next/app";

function App({ Component, pageProps }: AppProps) {
  useTrackBrowseSource();

  return (
    <>
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
