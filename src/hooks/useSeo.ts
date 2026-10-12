import { SeoConfig, baseUrl, seoConfigs } from "@/configs/seoConfig";
import { PageEnum } from "@/enums/PageEnum";
import { JsyBusRoute, JsyBusStopBoard } from "@/models/jsy-bus-info";
import { SOURCE_LABEL_KEY, toBusCityKey } from "@/utils/BusUtils";
import { localeToHreflang } from "@/utils/HreflangUtils";
import { getNameLangKey, getOgLocale } from "@/utils/LocaleUtils";
import { getStationNameById } from "@/utils/StationUtils";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import usePage from "./usePage";
import useSearchAreaParams from "./useSearchAreaParams";

/** 站牌頁 title 所需的看板識別 */
export type BusStopSeo = Pick<
  JsyBusStopBoard,
  "stopName" | "stopNameEn" | "city"
>;

const useSeo = (
  busRoute: JsyBusRoute | null = null,
  busStop: BusStopSeo | null = null,
) => {
  const { i18n, t } = useTranslation();
  const router = useRouter();
  const { page } = usePage();
  const { urlSearchAreaParams } = useSearchAreaParams();

  const getSeo = () => {
    const { startStationId, endStationId } = urlSearchAreaParams;
    const seoConfig = seoConfigs[page];

    // 以「站名能否解析成功」判斷是否為有效起訖站，與 PageSeo 的 hasValidStations 一致。
    // 無效站號（如 s=9999）會解析成空字串 → 視同空查詢，避免產出「從  到 」空殼 title
    // 與自指垃圾 canonical（?s=9999&e=8888）。非 search 頁無 s/e，亦自然落為 false。
    const startStationName = startStationId
      ? getStationNameById(page, startStationId, i18n.language)
      : "";
    const endStationName = endStationId
      ? getStationNameById(page, endStationId, i18n.language)
      : "";
    const hasValidStations = !!startStationName && !!endStationName;

    const ogLocale = getOgLocale(i18n.language);
    const ogAlternateLocales = router.locales
      .filter((loc) => loc !== i18n.language)
      .map((loc) => getOgLocale(loc));

    // 首頁 pathname 為 "/"，但 trailingSlash:false 下實際服務的是無尾斜線的根網址；
    // 正規化成 "" 避免 canonical / hreflang 指向會 308 重導的 "/" 或 "/en/"。
    const basePath = router.pathname === "/" ? "" : router.pathname;
    // 公車路線頁（與 s/e 互斥）：canonical 收斂到 routeUid(+子線)，不帶 dir——兩方向同屬一條路線。
    // 子線名取後端權威值，URL 帶非展開候選的 sub 會自然退回 route 粒度。
    const busQueryPath = busRoute
      ? `?routeUid=${encodeURIComponent(busRoute.routeUid)}${
          busRoute.subRouteName
            ? `&sub=${encodeURIComponent(busRoute.subRouteName)}`
            : ""
        }`
      : "";

    // 僅在站號有效時才附加 query，否則 canonical / hreflang 自指乾淨的 /search 基礎路徑，
    // 不把無效 OD（?s=9999&e=8888）寫進 canonical 製造雜訊。
    const queryPath = hasValidStations
      ? `?s=${startStationId}&e=${endStationId}`
      : busQueryPath;

    // Construct the self-referencing URL for the current page (for canonical/og:url)
    const currentLocale = i18n.language;
    const selfLocalePrefix =
      currentLocale === router.defaultLocale ? "" : `/${currentLocale}`;
    const selfUrl = `${baseUrl}${selfLocalePrefix}${basePath}${queryPath}`;

    // 為了給 next-seo 的 languageAlternates 使用：把 next-i18next 內部 locale
    // 轉換為對外 hreflang 標籤（zh-TW → zh-Hant，符合 Google 2023 後建議）
    const languageAlternates = router.locales.map((locale) => {
      const localePrefix = locale === router.defaultLocale ? "" : `/${locale}`;
      return {
        hrefLang: localeToHreflang(locale),
        href: `${baseUrl}${localePrefix}${basePath}${queryPath}`,
      };
    });

    // x-default 指向預設語系 URL（無 prefix），給未匹配任何 hreflang 的使用者
    languageAlternates.push({
      hrefLang: "x-default",
      href: `${baseUrl}${basePath}${queryPath}`,
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

    // 僅在站號可解析成站名時才產生「X 到 Y」動態 title / breadcrumb；
    // 站名（startStationName / endStationName）已於上方 hoist，無效站號不會進此分支。
    if (hasValidStations) {
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
        languageAlternates,
        ogLocale,
        ogAlternateLocales,
        breadcrumbs,
      };
    }

    // 公車路線頁：以路線名（子線優先）產出獨立 title / description。
    // 英文、韓文頁取英文名，缺則退中文
    if (busRoute) {
      const pickName = (zh: string, en?: string): string =>
        getNameLangKey(i18n.language) === "en" && en ? en : zh;
      const routeLabel = pickName(
        busRoute.subRouteName ?? busRoute.routeName,
        busRoute.routeNameEn,
      );
      const departureStop = pickName(
        busRoute.departureStop,
        busRoute.departureStopEn,
      );
      const destinationStop = pickName(
        busRoute.destinationStop,
        busRoute.destinationStopEn,
      );
      // 分類前綴：台灣好行優先，市區公車取縣市，其餘取來源（同搜尋候選）；
      // 前綴為來源名稱時已含「公車」語意，不另加名詞
      const isCityLabel =
        !busRoute.isTaiwanTrip && busRoute.source === "city" && !!busRoute.city;
      const placeLabel = busRoute.isTaiwanTrip
        ? t(SOURCE_LABEL_KEY.taiwantrip)
        : isCityLabel
          ? t(`busCity.${busRoute.city}`, { defaultValue: busRoute.city })
          : t(SOURCE_LABEL_KEY[busRoute.source]);
      const routeTitle =
        departureStop && destinationStop
          ? t(
              isCityLabel ? "busRouteTitleWithStops" : "busRouteNameWithStops",
              {
                routeName: routeLabel,
                departureStop,
                destinationStop,
              },
            )
          : isCityLabel
            ? t("busRouteTitle", { routeName: routeLabel })
            : routeLabel;
      // 路線名已含分類（如「台灣好行-D線-…」）時不重複加前綴
      const titleText = routeLabel.includes(placeLabel)
        ? routeTitle
        : `${placeLabel} ${routeTitle}`;
      const fullTitle = `${titleText} - ${t(page + "Title")}`;

      const description = (t: Function) =>
        t("busRoutePageDynamicDescription", {
          routeName: routeLabel,
          departureStop,
          destinationStop,
        });

      breadcrumbs.push({
        name: titleText,
        item: selfUrl,
      });

      return {
        seo: {
          ...seoConfig,
          title: () => fullTitle,
          description: (t: Function) => description(t),
          ogTitle: () => fullTitle,
          ogDescription: (t: Function) => description(t),
        } as SeoConfig,
        selfUrl,
        languageAlternates,
        ogLocale,
        ogAlternateLocales,
        breadcrumbs,
      };
    }

    // 公車站牌頁：縣市 + 站名（canonical 仍收斂至 /bus，僅供分頁 / 書籤辨識）
    if (busStop) {
      const stopName =
        getNameLangKey(i18n.language) === "en" && busStop.stopNameEn
          ? busStop.stopNameEn
          : busStop.stopName;
      const placeLabel = t(`busCity.${toBusCityKey(busStop.city)}`, {
        defaultValue: "",
      });
      const titleText = [placeLabel, t("busStopTitle", { stopName })]
        .filter(Boolean)
        .join(" ");
      const fullTitle = `${titleText} - ${t(page + "Title")}`;

      return {
        seo: {
          ...seoConfig,
          title: () => fullTitle,
          ogTitle: () => fullTitle,
        } as SeoConfig,
        selfUrl,
        languageAlternates,
        ogLocale,
        ogAlternateLocales,
        breadcrumbs,
      };
    }

    return {
      seo: { ...seoConfig },
      selfUrl,
      languageAlternates,
      ogLocale,
      ogAlternateLocales,
      breadcrumbs,
    };
  };

  return getSeo();
};

export default useSeo;
