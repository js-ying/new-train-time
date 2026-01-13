import JsonLd from "@/components/layout/JsonLd";
import useLang from "@/hooks/useLang";
import useSeo from "@/hooks/useSeo";
import { useTranslation } from "next-i18next";
import { useTheme } from "next-themes";
import Head from "next/head";
import { FC } from "react";

const PageHead: FC = () => {
  const { t } = useTranslation();
  const {
    seo,
    selfUrl,
    alternateUrls,
    ogLocale,
    ogAlternateLocales,
    breadcrumbs,
  } = useSeo();
  const { isTw } = useLang();
  const { theme } = useTheme();

  return (
    <Head>
      {/* Title & Description */}
      <title key="title">{seo.title(t)}</title>
      <meta key="description" name="description" content={seo.description(t)} />
      <link key="canonical" rel="canonical" href={selfUrl} />

      {/* Alternate Language URLs */}
      {alternateUrls.map((loc) => (
        <link
          key={`alternate-${loc.locale}`}
          rel="alternate"
          hrefLang={loc.locale}
          href={loc.url}
        />
      ))}

      {/* Open Graph */}
      <meta key="og:type" property="og:type" content="website" />
      <meta key="og:title" property="og:title" content={seo.ogTitle(t)} />
      <meta
        key="og:description"
        property="og:description"
        content={seo.ogDescription(t)}
      />
      <meta
        key="og:site_name"
        property="og:site_name"
        content={seo.ogTitle(t)}
      />
      <meta key="og:url" property="og:url" content={selfUrl} />
      {seo.ogImage && (
        <meta key="og:image" property="og:image" content={seo.ogImage} />
      )}
      <meta key="og:locale" property="og:locale" content={ogLocale} />
      {ogAlternateLocales.map((loc) => (
        <meta
          key={`og:locale:alternate-${loc}`}
          property="og:locale:alternate"
          content={loc}
        />
      ))}

      {/* Icon */}
      <link rel="shortcut icon" href="/images/logos/logo-32.png" />

      {/* Viewport */}
      <meta
        key="viewport"
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
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

      {/* JSON LD */}
      <JsonLd
        trTitle={t("trTitle")}
        webDescription={t("webDescription")}
        breadcrumbs={breadcrumbs}
      />
    </Head>
  );
};

export default PageHead;
