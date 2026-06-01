import BreadcrumbJsonLd from "@/components/seo/json-ld/BreadcrumbJsonLd";
import OrganizationJsonLd from "@/components/seo/json-ld/OrganizationJsonLd";
import TrainTripJsonLd from "@/components/seo/json-ld/TrainTripJsonLd";
import WebSiteJsonLd from "@/components/seo/json-ld/WebSiteJsonLd";
import usePage from "@/hooks/usePage";
import useSearchAreaParams from "@/hooks/useSearchAreaParams";
import useSeo from "@/hooks/useSeo";
import { getStationNameById } from "@/utils/StationUtils";
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
  const { t, i18n } = useTranslation();
  const { pathname } = useRouter();
  const { isTr, page } = usePage();
  const { urlSearchAreaParams } = useSearchAreaParams();
  const {
    seo,
    selfUrl,
    languageAlternates,
    ogLocale,
    ogAlternateLocales,
    breadcrumbs,
  } = useSeo();

  // 站台根（台鐵首頁 /）掛 site-level 實體：WebSite + Organization 都是全站單例，
  // 只在根首頁宣告一次（THSR / TYMC 共用 Home 元件，但不重複掛）。
  const isHome = !pathname.includes("search");
  const showSiteEntity = isHome && isTr;

  // 搜尋頁：用「能否解析出實際站名」判斷是否為有效結果頁，而非只看 query 是否存在。
  // 無效起訖站（如 s=9999&e=8888）會解析成 null，視同空查詢。
  const isSearchPage = pathname.includes("search");
  const startStationName = getStationNameById(
    page,
    urlSearchAreaParams.startStationId,
    i18n.language,
  );
  const endStationName = getStationNameById(
    page,
    urlSearchAreaParams.endStationId,
    i18n.language,
  );
  const hasValidStations = !!startStationName && !!endStationName;
  const showTrainTrip = isSearchPage && hasValidStations;

  // 無有效起訖站的 search 頁（空查詢，或 s=9999 這類無效站號）是 index 頁的重複內容、
  // 無 SEO 價值 → noindex（仍 follow，保留對帶參數結果頁的連結權重）。改用 hasValidStations
  // 後，無效站號不再產出「從  到 」的 soft-404 被索引，也不會輸出空殼 TrainTrip schema。
  // 帶有效起訖站的結果頁維持可索引，是工具型網站主要的 SEO 著陸頁。
  const noindex = isSearchPage && !hasValidStations;

  return (
    <>
      <NextSeo
        title={seo.title(t)}
        description={seo.description(t)}
        canonical={selfUrl}
        noindex={noindex}
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
      {showSiteEntity && <WebSiteJsonLd />}
      <BreadcrumbJsonLd breadcrumbs={breadcrumbs} />
      {showSiteEntity && <OrganizationJsonLd />}
      {showTrainTrip && <TrainTripJsonLd />}
    </>
  );
};

export default PageSeo;
