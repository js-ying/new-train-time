import BreadcrumbJsonLd from "@/components/seo/json-ld/BreadcrumbJsonLd";
import { baseUrl } from "@/configs/seoConfig";
import { JsyTrStationTimetable } from "@/models/jsy-tr-info";
import { localeToHreflang } from "@/utils/HreflangUtils";
import { getOgLocale } from "@/utils/LocaleUtils";
import { getTrStationNameById } from "@/utils/StationUtils";
import { useTranslation } from "next-i18next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { FC } from "react";

interface TrStationPageSeoProps {
  stationId: string | null;
  directionFilter: number;
  data: JsyTrStationTimetable | null;
}

/**
 * 單站時刻表頁 SEO（自寫 NextSeo；不走 OD 雙站綁定的 useSeo / PageSeo）。
 * - 帶有效站時可索引、canonical 自指 ?station=&dir=（北上/南下各自一條 URL）。
 * - 裸頁（無/無效站）noindex（沿用站內 noindex-not-Disallow 政策）。
 */
const TrStationPageSeo: FC<TrStationPageSeoProps> = ({
  stationId,
  directionFilter,
  data,
}) => {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const stationName = stationId
    ? getTrStationNameById(stationId, i18n.language)
    : null;
  const isValid = !!stationName;

  // 西部主線才把 north/south 納入 SEO（利「站名+北上/南下時刻表」關鍵字）；支線無方向詞
  const dirInfo = data?.directions.find((d) => d.direction === directionFilter);
  const dir = dirInfo?.showNorthSouth ? dirInfo.northSouth : null;
  const dirWord = dir
    ? t(dir === "north" ? "trStationBoardNorthbound" : "trStationBoardSouthbound")
    : "";

  // 標題一律加「 - 台鐵時刻查詢」後綴（比照站內其他頁）
  const baseTitle = isValid
    ? dir
      ? t("trStationBoardDirSeoTitle", { station: stationName, dir: dirWord })
      : t("trStationBoardStationSeoTitle", { station: stationName })
    : t("trStationBoardPageTitle");
  const title = `${baseTitle} - ${t("trTitle")}`;
  const description = isValid
    ? t("trStationBoardStationSeoDescription", { station: stationName })
    : t("trStationBoardPageDescription");

  // canonical / hreflang（沿用 useSeo 的 selfLocalePrefix 寫法）
  const queryPath = isValid
    ? `?station=${stationId}${dir ? `&dir=${dir}` : ""}`
    : "";
  const selfLocalePrefix =
    i18n.language === router.defaultLocale ? "" : `/${i18n.language}`;
  const selfUrl = `${baseUrl}${selfLocalePrefix}/station${queryPath}`;

  const languageAlternates = router.locales.map((loc) => {
    const prefix = loc === router.defaultLocale ? "" : `/${loc}`;
    return {
      hrefLang: localeToHreflang(loc),
      href: `${baseUrl}${prefix}/station${queryPath}`,
    };
  });
  languageAlternates.push({
    hrefLang: "x-default",
    href: `${baseUrl}/station${queryPath}`,
  });

  const homeUrl =
    i18n.language === router.defaultLocale
      ? baseUrl
      : `${baseUrl}/${i18n.language}`;
  const breadcrumbs = [
    { name: t("trTitle"), item: homeUrl },
    { name: baseTitle, item: selfUrl },
  ];

  return (
    <>
      <NextSeo
        title={title}
        description={description}
        canonical={selfUrl}
        noindex={!isValid}
        languageAlternates={languageAlternates}
        openGraph={{
          title,
          description,
          url: selfUrl,
          siteName: t("trTitle"),
          locale: getOgLocale(i18n.language),
        }}
      />
      <BreadcrumbJsonLd breadcrumbs={breadcrumbs} />
    </>
  );
};

export default TrStationPageSeo;
