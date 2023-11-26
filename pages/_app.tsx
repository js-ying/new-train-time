import { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { appWithTranslation } from "next-i18next";

import "../styles/global.css";

function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default appWithTranslation(App);
