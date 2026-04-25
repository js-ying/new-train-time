import BreadcrumbJsonLd from "@/components/seo/json-ld/BreadcrumbJsonLd";
import OrganizationJsonLd from "@/components/seo/json-ld/OrganizationJsonLd";
import TrainTripJsonLd from "@/components/seo/json-ld/TrainTripJsonLd";
import WebSiteJsonLd from "@/components/seo/json-ld/WebSiteJsonLd";
import usePage from "@/hooks/usePage";
import useSearchAreaParams from "@/hooks/useSearchAreaParams";
import useSeo from "@/hooks/useSeo";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { FC } from "react";

/**
 * 各 page 在最外層渲染的 SEO 元件。
 *
 * 負責：
 * - NextSeo（title / description / canonical / og / twitter / hreflang）
 * - WebSite + Breadcrumb JSON-LD（每頁皆有）
 * - 首頁額外加 Organization JSON-LD
 * - 搜尋頁含起訖站時額外加 TrainTrip JSON-LD
 */
const PageSeo: FC = () => {
  const { t } = useTranslation();
  const { pathname } = useRouter();
  const { isTr } = usePage();
  const { urlSearchAreaParams } = useSearchAreaParams();
  const {
    seo,
    selfUrl,
    languageAlternates,
    ogLocale,
    ogAlternateLocales,
    breadcrumbs,
  } = useSeo();

  // 首頁：台鐵首頁掛 Organization；THSR / TYMC 共用 Home 元件，但不重複掛
  const isHome = !pathname.includes("search");
  const showOrganization = isHome && isTr;

  // 搜尋頁含起訖站才有 TrainTrip schema 可用
  const showTrainTrip =
    pathname.includes("search") &&
    !!urlSearchAreaParams.startStationId &&
    !!urlSearchAreaParams.endStationId;

  return (
    <>
      <NextSeo
        title={seo.title(t)}
        description={seo.description(t)}
        canonical={selfUrl}
        languageAlternates={languageAlternates}
        openGraph={{
          title: seo.ogTitle(t),
          description: seo.ogDescription(t),
          url: selfUrl,
          siteName: seo.ogTitle(t),
          locale: ogLocale,
          ...(seo.ogImage
            ? { images: [{ url: seo.ogImage, alt: seo.ogTitle(t) }] }
            : {}),
        }}
        // og:locale:alternate 不在 next-seo 的 openGraph 型別內，用 additionalMetaTags 補
        additionalMetaTags={ogAlternateLocales.map((loc) => ({
          property: "og:locale:alternate",
          content: loc,
        }))}
      />
      <WebSiteJsonLd />
      <BreadcrumbJsonLd breadcrumbs={breadcrumbs} />
      {showOrganization && <OrganizationJsonLd />}
      {showTrainTrip && <TrainTripJsonLd />}
    </>
  );
};

export default PageSeo;
