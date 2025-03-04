import { localeUrlList } from "@/configs/seoConfig";
import useLang from "@/hooks/useLangHook";
import useSeo from "@/hooks/useSeoHook";
import { useTranslation } from "next-i18next";
import { useTheme } from "next-themes";
import Head from "next/head";
import { FC } from "react";

const PageHead: FC = () => {
  const { t } = useTranslation();
  const { seo } = useSeo();
  const { isTw } = useLang();
  const { theme } = useTheme();

  return (
    <Head>
      <link rel="shortcut icon" href="/images/logos/logo-32.png" />
      <title>{seo.title(t)}</title>
      <meta name="description" content={seo.description(t)} />
      {seo.keywords && <meta name="keywords" content={seo.keywords} />}

      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
      />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={seo.ogTitle(t)} />
      <meta property="og:description" content={seo.ogDescription(t)} />
      <meta property="og:site_name" content={seo.ogTitle(t)} />
      <meta property="og:url" content={seo.ogUrl} />
      {seo.ogImage && <meta property="og:image" content={seo.ogImage} />}

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

      {localeUrlList.map((loc) => (
        <link
          key={loc.locale}
          rel="alternate"
          hrefLang={loc.locale}
          href={`${loc.url}${seo.localeUrl}`}
        />
      ))}
    </Head>
  );
};

export default PageHead;
