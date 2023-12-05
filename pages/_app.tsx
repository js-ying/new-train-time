import { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { appWithTranslation } from "next-i18next";
import { SearchAreaProvider } from "../contexts/SearchAreaContext";

import "../styles/global.scss";

function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <SearchAreaProvider>
        <Component {...pageProps} />
      </SearchAreaProvider>
    </ThemeProvider>
  );
}

export default appWithTranslation(App);
