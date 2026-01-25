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

    // 根據語系取得正確的根路徑 URL
    const homeUrl =
      currentLocale === router.defaultLocale
        ? baseUrl
        : `${baseUrl}/${currentLocale}`;

    // 建立 Breadcrumbs 麵包屑導航數據 (供 JSON-LD 使用)
    const breadcrumbs = [
      {
        name: t("trTitle"), // 第一層使用網站主要名稱「台鐵時刻查詢」，作為品牌入口
        item: homeUrl,
      },
    ];

    // 第二層是各交通方式（高鐵、桃園捷運、特色介紹等）
    if (page !== PageEnum.TR) {
      breadcrumbs.push({
        name: t(`${page.toLowerCase()}`), // 使用專屬標題如「高鐵」
        item: selfUrl.split("?")[0], // 導向該交通工具的首頁
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

      const titleText = t("stationToStationTimeTableTitle", {
        startStation: startStationName,
        endStation: endStationName,
      });

      const fullTitle = `${titleText} - ${t(page + "Title")}`;

      const description = (t: Function) => {
        const descriptionKey = `${page.toLowerCase()}SearchPageDynamicDescription`;
        return t(descriptionKey, {
          startStation: startStationName,
          endStation: endStationName,
          page: t(page),
        });
      };

      const dynamicSeo: SeoConfig = {
        ...seoConfig,
        title: () => fullTitle,
        description: (t) => description(t),
        ogTitle: () => fullTitle,
        ogDescription: (t) => description(t),
      };

      // 第三層是搜尋結果（簡化名稱，移除後綴以便在手機端顯示更好）
      breadcrumbs.push({
        name: titleText,
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
