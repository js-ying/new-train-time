import { SeoConfig, baseUrl, seoConfigs } from "@/configs/seoConfig";
import { getOgLocale } from "@/utils/LocaleUtils";
import { getStationNameById } from "@/utils/StationUtils";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import usePage from "./usePageHook";
import useSearchAreaParams from "./useSearchAreaParamsHook";

const useSeo = () => {
  const { i18n } = useTranslation();
  const router = useRouter();
  const { page } = usePage();
  const { urlSearchAreaParams } = useSearchAreaParams();

  const getSeo = () => {
    const { startStationId, endStationId } = urlSearchAreaParams;
    const seoConfig = seoConfigs[page];

    const ogLocale = getOgLocale(i18n.language);
    const ogAlternateLocales = router.locales
      .filter((loc) => loc !== i18n.language)
      .map((loc) => getOgLocale(loc));

    // Determine the base path (e.g., "/THSR/search" or "/THSR")
    const basePath = router.pathname;

    // Determine the query string part (e.g., "?s=...&e=...")
    const queryPath =
      startStationId && endStationId
        ? `?s=${startStationId}&e=${endStationId}`
        : "";

    // Construct the fixed URL (always default locale, no locale prefix)
    const fixedUrl = `${baseUrl}${basePath}${queryPath}`;

    // Construct alternate URLs for hreflang
    const alternateUrls = router.locales.map((locale) => {
      const localePrefix = locale === router.defaultLocale ? "" : `/${locale}`;
      return {
        locale,
        url: `${baseUrl}${localePrefix}${basePath}${queryPath}`,
      };
    });

    if (startStationId && endStationId) {
      const startStationName = getStationNameById(
        page,
        startStationId,
        i18n.language,
      );
      const endStationName = getStationNameById(
        page,
        endStationId,
        i18n.language,
      );

      const title = (
        t: Function,
        startStationName: string,
        endStationName: string,
      ) => {
        return `${t("stationToStationTimeTableTitle", {
          startStation: startStationName,
          endStation: endStationName,
        })} - ${t(page + "Title")}`;
      };

      const dynamicSeo: SeoConfig = {
        ...seoConfig,
        title: (t) => title(t, startStationName, endStationName),
        ogTitle: (t) => title(t, startStationName, endStationName),
      };

      return {
        seo: dynamicSeo,
        fixedUrl,
        alternateUrls,
        ogLocale,
        ogAlternateLocales,
      };
    }

    // For non-search pages or pages without s/e params
    return {
      seo: { ...seoConfig },
      fixedUrl,
      alternateUrls,
      ogLocale,
      ogAlternateLocales,
    };
  };

  return getSeo();
};

export default useSeo;
