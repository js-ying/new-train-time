import { baseUrl } from "@/configs/seoConfig";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { FC } from "react";

/**
 * WebSite JSON-LD：宣告網站名稱、描述、語系與多語別名。
 *
 * 由各頁面在 PageSeo 中渲染（透過 next-seo Head 注入或直接 <script> 注入皆可），
 * 此處用原生 <script type="application/ld+json"> 經 next/head 注入，避免引入 next-seo
 * 對非標準 schema 的封裝開銷。
 */
const WebSiteJsonLd: FC = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const currentLocale = i18n.language;
  const homeUrl =
    currentLocale === router.defaultLocale
      ? baseUrl
      : `${baseUrl}/${currentLocale}`;
  // schema.org 的 inLanguage 採 IETF BCP-47；繁中採 zh-Hant-TW（含書寫系統 + 地區）
  const inLanguage = currentLocale === "zh-TW" ? "zh-Hant-TW" : currentLocale;

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: t("trTitle"),
    alternateName: t("siteAlternateNames", { returnObjects: true }) as string[],
    url: homeUrl,
    description: t("webDescription"),
    inLanguage,
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default WebSiteJsonLd;
