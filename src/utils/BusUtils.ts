import { BusSource, JsyBusRoute } from "@/models/jsy-bus-info";
import { StationTarget } from "@/models/station-history";
import type { TFunction } from "i18next";
import { getNameLangKey } from "./LocaleUtils";

/** 路線來源 → i18n key（市區公車另以縣市名取代）。 */
export const SOURCE_LABEL_KEY: Record<JsyBusRoute["source"], string> = {
  city: "busSourceCity",
  intercity: "busSourceIntercity",
  taiwantrip: "busSourceTaiwanTrip",
};

/** TDX 縣市三碼（公路客運 / 台灣好行站牌的 LocationCityCode）→ busCity i18n key */
const CITY_CODE_TO_BUS_CITY: Record<string, string> = {
  TPE: "Taipei",
  NWT: "NewTaipei",
  TAO: "Taoyuan",
  TXG: "Taichung",
  TNN: "Tainan",
  KHH: "Kaohsiung",
  KEE: "Keelung",
  HSZ: "Hsinchu",
  HSQ: "HsinchuCounty",
  MIA: "MiaoliCounty",
  CHA: "ChanghuaCounty",
  NAN: "NantouCounty",
  YUN: "YunlinCounty",
  CYI: "Chiayi",
  CYQ: "ChiayiCounty",
  PIF: "PingtungCounty",
  ILA: "YilanCounty",
  HUA: "HualienCounty",
  TTT: "TaitungCounty",
  PEN: "PenghuCounty",
  KIN: "KinmenCounty",
  LIE: "LienchiangCounty",
};

/** 縣市碼統一成 busCity key：市區公車碼原樣、三碼轉換、未知原樣回傳 */
export const toBusCityKey = (code: string): string =>
  CITY_CODE_TO_BUS_CITY[code] ?? code;

/**
 * 公車路線頁標題組字（useSeo 與熱門路線快查共用）。
 * label＝「縣市 / 分類 + 路線名」；titleText＝頁面標題主體（不含站名後綴）。
 * 英文、韓文取英文名，缺則退中文。
 */
export const buildBusRouteTitle = (
  t: TFunction,
  language: string,
  route: JsyBusRoute,
) => {
  const pickName = (zh: string, en?: string): string =>
    getNameLangKey(language) === "en" && en ? en : zh;
  const routeLabel = pickName(
    route.subRouteName ?? route.routeName,
    route.routeNameEn,
  );
  const departureStop = pickName(route.departureStop, route.departureStopEn);
  const destinationStop = pickName(
    route.destinationStop,
    route.destinationStopEn,
  );
  // 分類前綴：台灣好行優先，市區公車取縣市，其餘取來源（同搜尋候選）；
  // 前綴為來源名稱時已含「公車」語意，不另加名詞
  const isCityLabel =
    !route.isTaiwanTrip && route.source === "city" && !!route.city;
  const placeLabel = route.isTaiwanTrip
    ? t(SOURCE_LABEL_KEY.taiwantrip)
    : isCityLabel
      ? t(`busCity.${route.city}`, { defaultValue: route.city })
      : t(SOURCE_LABEL_KEY[route.source]);
  const routeTitle =
    departureStop && destinationStop
      ? t(isCityLabel ? "busRouteTitleWithStops" : "busRouteNameWithStops", {
          routeName: routeLabel,
          departureStop,
          destinationStop,
        })
      : isCityLabel
        ? t("busRouteTitle", { routeName: routeLabel })
        : routeLabel;
  // 路線名已含分類（如「台灣好行-D線-…」）時不重複加前綴
  const hasPlace = routeLabel.includes(placeLabel);
  return {
    routeLabel,
    departureStop,
    destinationStop,
    label: hasPlace ? routeLabel : `${placeLabel} ${routeLabel}`,
    titleText: hasPlace ? routeTitle : `${placeLabel} ${routeTitle}`,
  };
};

export const BUS_SOURCES: BusSource[] = ["city", "intercity", "taiwantrip"];

/**
 * 公車歷史 / 收藏的 meta 編解碼：route_uid 不足以重查看板（arrivals 需 source，source=city 需 city），
 * 故把路由資訊存進通用單點表的 meta 欄（"source|city"）。
 */
export const encodeBusMeta = (source: BusSource, city?: string): string =>
  `${source}|${city ?? ""}`;

export const decodeBusMeta = (
  meta?: string,
): { source: BusSource; city?: string } => {
  const [rawSource, rawCity] = (meta ?? "").split("|");
  const source = BUS_SOURCES.includes(rawSource as BusSource)
    ? (rawSource as BusSource)
    : "city";
  return { source, city: rawCity || undefined };
};

/**
 * 歷史 / 收藏的 targetId 編解碼：含子線時 `routeUid|subRouteName`，否則純 routeUid。
 * 同 routeUid 多子線需各成一筆（key 唯一），舊純 routeUid 資料解出無子線＝route 粒度，相容。
 */
export const encodeBusTargetId = (
  routeUid: string,
  subRouteName?: string,
): string => (subRouteName ? `${routeUid}|${subRouteName}` : routeUid);

export const parseBusTargetId = (
  targetId: string,
): { routeUid: string; subRouteName?: string } => {
  const idx = targetId.indexOf("|");
  return idx < 0
    ? { routeUid: targetId }
    : {
        routeUid: targetId.slice(0, idx),
        subRouteName: targetId.slice(idx + 1) || undefined,
      };
};

/** 公車歷史 / 收藏 target → 選路線用的最小 route（無起訖站，看板由 routeUid 重查）。 */
export const busTargetToRoute = (target: StationTarget): JsyBusRoute => {
  const { source, city } = decodeBusMeta(target.meta);
  const { routeUid, subRouteName } = parseBusTargetId(target.targetId);
  return {
    routeUid,
    routeName: target.targetName,
    subRouteName,
    source,
    city,
    departureStop: "",
    destinationStop: "",
    routeType: 0,
  };
};

/** 路線看板網址的 query：只帶 routeUid、子線與方向（與 canonical 規則一致，不帶 name / source / city）。 */
export const buildBusRouteQuery = (
  routeUid: string,
  subRouteName?: string,
  dir?: number,
): Record<string, string> => ({
  routeUid,
  ...(subRouteName ? { sub: subRouteName } : {}),
  ...(dir != null ? { dir: String(dir) } : {}),
});
