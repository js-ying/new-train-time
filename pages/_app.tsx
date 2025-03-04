import GoogleScript from "@/components/GoogleScript";
import PageHead from "@/components/layout/PageHead";
import { PwaProvider } from "@/contexts/PwaContext";
import { SearchAreaProvider } from "@/contexts/SearchAreaContext";
import { SettingProvider } from "@/contexts/SettingContext";
import { HeroUIProvider } from "@heroui/react";
import { appWithTranslation } from "next-i18next";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AppProps } from "next/app";
import "../styles/global.scss";

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <PageHead />
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
