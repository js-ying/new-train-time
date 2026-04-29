import useLang from "@/hooks/useLang";
import { useTheme } from "next-themes";
import Head from "next/head";
import { FC } from "react";

/**
 * 全站固定的非 SEO meta（PWA / icon / theme-color / viewport）。
 * SEO 相關（title、og、twitter、canonical、hreflang、JSON-LD）由 PageSeo 元件處理。
 */
const AppMeta: FC = () => {
  const { isTw } = useLang();
  const { theme } = useTheme();

  return (
    <Head>
      {/* Icon */}
      <link rel="shortcut icon" href="/images/logos/logo-32.png" />

      {/* Viewport */}
      <meta
        key="viewport"
        name="viewport"
        content="width=device-width, initial-scale=1, viewport-fit=cover"
      />

      {/* PWA */}
      <link
        key="manifest"
        rel="manifest"
        href={`${isTw ? "/manifest.json" : "/manifest.en.json"}`}
      />
      <meta
        key="theme-color"
        name="theme-color"
        content={theme === "light" ? "#FFFFFF" : "#212529"}
      />

      {/* Apple Touch Settings */}
      <meta
        key="apple-mobile-web-app-capable"
        name="apple-mobile-web-app-capable"
        content="yes"
      />
      <meta
        key="mobile-web-app-capable"
        name="mobile-web-app-capable"
        content="yes"
      />
      <meta
        key="apple-touch-fullscreen"
        name="apple-touch-fullscreen"
        content="yes"
      />

      {/* Apple Touch Icons */}
      <link
        key="apple-touch-icon"
        rel="apple-touch-icon"
        href="/images/logos/logo-32.png"
      />
      <link
        key="apple-touch-icon-152"
        rel="apple-touch-icon"
        sizes="152x152"
        href="/images/logos/logo-192.png"
      />
      <link
        key="apple-touch-icon-180"
        rel="apple-touch-icon"
        sizes="180x180"
        href="/images/logos/logo-192.png"
      />
      <link
        key="apple-touch-icon-167"
        rel="apple-touch-icon"
        sizes="167x167"
        href="/images/logos/logo-192.png"
      />
      <link key="mask-icon" rel="mask-icon" href="/images/logos/logo-32.png" />
    </Head>
  );
};

export default AppMeta;
