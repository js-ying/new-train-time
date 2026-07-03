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
 * - 裸 hub 頁與帶有效站皆可索引；canonical 各自自指（/station 或 ?station=&dir=）。
 * - 僅帶無效站號時 noindex（soft-404 防護）。
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

  // 裸 hub 頁（未帶站）是各站北上/南下時刻表著陸頁、可索引；僅帶無效站號才 noindex 防 soft-404
  const noindex = !!stationId && !isValid;

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
        noindex={noindex}
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
