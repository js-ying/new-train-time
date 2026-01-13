import { SeoConfig, baseUrl, seoConfigs } from "@/configs/seoConfig";
import { PageEnum } from "@/enums/PageEnum";
import { getOgLocale } from "@/utils/LocaleUtils";
import { getStationNameById } from "@/utils/StationUtils";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import usePage from "./usePage";
import useSearchAreaParams from "./useSearchAreaParams";

const useSeo = () => {
  const { i18n, t } = useTranslation();
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

    const basePath = router.pathname;
    const queryPath =
      startStationId && endStationId
        ? `?s=${startStationId}&e=${endStationId}`
        : "";

    // Construct the self-referencing URL for the current page (for canonical/og:url)
    const currentLocale = i18n.language;
    const selfLocalePrefix =
      currentLocale === router.defaultLocale ? "" : `/${currentLocale}`;
    const selfUrl = `${baseUrl}${selfLocalePrefix}${basePath}${queryPath}`;

    // Construct alternate URLs for hreflang
    const alternateUrls = router.locales.map((locale) => {
      const localePrefix = locale === router.defaultLocale ? "" : `/${locale}`;
      return {
        locale,
        url: `${baseUrl}${localePrefix}${basePath}${queryPath}`,
      };
    });

    // Add x-default for users with unmatched languages
    const defaultLocaleUrl = `${baseUrl}${basePath}${queryPath}`;
    alternateUrls.push({
      locale: "x-default",
      url: defaultLocaleUrl,
    });

    // 建立 Breadcrumbs 麵包屑導航數據 (供 JSON-LD 使用)
    const breadcrumbs = [
      {
        name: t("tr"), // 麵包屑第一層永遠是「台鐵」
        item: baseUrl,
      },
    ];

    // 第二層是「高鐵」、「桃園捷運」、「特色介紹」、「更新公告」等等
    if (page !== PageEnum.TR) {
      breadcrumbs.push({
        name: t(page),
        item: selfUrl,
      });
    }

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

      // 第三層是搜尋結果
      breadcrumbs.push({
        name: title(t, startStationName, endStationName),
        item: selfUrl,
      });

      return {
        seo: dynamicSeo,
        selfUrl,
        alternateUrls,
        ogLocale,
        ogAlternateLocales,
        breadcrumbs,
      };
    }

    return {
      seo: { ...seoConfig },
      selfUrl,
      alternateUrls,
      ogLocale,
      ogAlternateLocales,
      breadcrumbs,
    };
  };

  return getSeo();
};

export default useSeo;
