import { PageEnum } from "@/enums/PageEnum";
import {
  thsrStationDataList,
  TrStationData,
  trStationDataList,
  tymcStationDataList,
} from "@/data/stationsData";
import { LocaleEnum } from "@/enums/LocaleEnum";
import { JsyName } from "@/models/jsy-tr-info";
import { getNameLangKey, getTdxLang } from "./LocaleUtils";

/** 不列入車站選單、搜尋與定位的台鐵站（無一般旅客列車停靠） */
export const EXCLUDED_TR_STATION_IDS: readonly string[] = [
  "1001", // 臺北-環島：環島之星列車起訖標記
  "5170", // 枋野：號誌站
  "5998", // 南方小站：機廠員工月台
  "5999", // 潮州基地：車輛基地
  "7140", // 新馬：暫停客運
];

/** 把「台」「臺」視為同字（全域替換，供站名比對；前後端篩選須一致） */
export const normalizeTaiTai = (s: string): string => s.replace(/台/g, "臺");

/** 是否為有效台鐵站號（存在且不在排除清單） */
export const isValidTrStationId = (stationId: string): boolean =>
  !!stationId &&
  !EXCLUDED_TR_STATION_IDS.includes(stationId) &&
  trStationDataList.some((s) => s.StationID === stationId);

/** 日文新字體 → 繁體（站名常見字），讓日文輸入法打出的字也能命中 */
const SHINJITAI_TO_TRAD: Record<string, string> = {
  営: "營",
  豊: "豐",
  亀: "龜",
  渓: "溪",
  栄: "榮",
  内: "內",
  徳: "德",
  辺: "邊",
  帰: "歸",
  関: "關",
  権: "權",
  学: "學",
  楽: "樂",
  双: "雙",
  脚: "腳",
  禄: "祿",
  寿: "壽",
  穂: "穗",
  讃: "讚",
  横: "橫",
  荘: "莊",
  抜: "拔",
  国: "國",
  区: "區",
  産: "產",
  体: "體",
  県: "縣",
  鉄: "鐵",
  湾: "灣",
  広: "廣",
  沢: "澤",
  竜: "龍",
  浜: "濱",
  駅: "站",
};
const SHINJITAI_RE = new RegExp(
  `[${Object.keys(SHINJITAI_TO_TRAD).join("")}]`,
  "g",
);

/** 站名比對用正規化：去空白、轉小寫、台↔臺同字、新字體轉繁體 */
const normalizeStationKeyword = (s: string): string =>
  normalizeTaiTai(
    s
      .replace(/\s+/g, "")
      .toLowerCase()
      .replace(SHINJITAI_RE, (c) => SHINJITAI_TO_TRAD[c]),
  );

/** 站名是否符合輸入（不分介面語系，中英日韓 + 站號皆比對；輸入尾端的 站 / 駅 / 역 可省略） */
export const isStationNameMatchInput = (
  station: {
    StationID: string;
    StationName: Record<"Zh_tw" | "En" | "Ja" | "Ko", string>;
  },
  input: string,
): boolean => {
  const keyword = normalizeStationKeyword(input);
  if (!keyword) return true;
  if (station.StationID.includes(keyword)) return true;
  const stripped = keyword.replace(/[站역]$/, "") || keyword;
  const { Zh_tw, En, Ja, Ko } = station.StationName;
  return [Zh_tw, En, Ja, Ko].some((name) => {
    const n = normalizeStationKeyword(name);
    return n.includes(keyword) || n.includes(stripped);
  });
};

/** 台鐵站名是否符合輸入（排除清單內的站一律不命中） */
export const isTrStationMatchInput = (
  station: TrStationData,
  input: string,
): boolean => {
  if (EXCLUDED_TR_STATION_IDS.includes(station.StationID)) return false;
  return isStationNameMatchInput(station, input);
};

/** 站是否屬指定縣市（以地址前三字比對，沿用既有 picker 縣市分層規則） */
export const isTrStationInCounty = (
  station: TrStationData,
  county: string,
): boolean => {
  if (!county || EXCLUDED_TR_STATION_IDS.includes(station.StationID))
    return false;
  return (
    station.StationAddress.replace(/[0-9]/g, "").substring(0, 3) === county
  );
};

/** 由經緯度取最近的台鐵車站站號（haversine 角距）；找不到回 null */
export const getNearestTrStation = (
  lat: number,
  lon: number,
): string | null => {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  let nearestId: string | null = null;
  let minDist = Infinity;
  for (const s of trStationDataList) {
    if (EXCLUDED_TR_STATION_IDS.includes(s.StationID)) continue;
    const dLat = toRad(s.StationPosition.PositionLat - lat);
    const dLon = toRad(s.StationPosition.PositionLon - lon);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat)) *
        Math.cos(toRad(s.StationPosition.PositionLat)) *
        Math.sin(dLon / 2) ** 2;
    const dist = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    if (dist < minDist) {
      minDist = dist;
      nearestId = s.StationID;
    }
  }
  return nearestId;
};

/** 取得車站名稱 by ID */
export const getStationNameById = (
  page: PageEnum,
  stationId: string,
  lang: string,
): string => {
  if (page === PageEnum.TR) {
    return getTrStationNameById(stationId, lang);
  }

  if (page === PageEnum.THSR) {
    return getThsrStationNameById(stationId, lang);
  }

  if (page === PageEnum.TYMC) {
    return getTymcStationNameById(stationId, lang);
  }

  return "";
};

/** 取得車站 ID by 名稱 */
export const getStationIdByName = (
  page: PageEnum,
  stationName: string,
  lang: string,
): string => {
  if (page === PageEnum.TR) {
    return getTrStationIdByName(stationName, lang);
  }

  if (page === PageEnum.THSR) {
    return getThsrStationIdByName(stationName, lang);
  }

  if (page === PageEnum.TYMC) {
    return getTymcStationIdByName(stationName, lang);
  }

  return "";
};

/**
 * 取得 [台鐵] 車站名稱 by ID
 * @param stationId
 * @param lang
 * @returns
 */
export const getTrStationNameById = (
  stationId: string,
  lang: string,
): string => {
  if (!stationId || !lang) return null;

  const station = trStationDataList.find(
    (trStation) => trStation.StationID === stationId,
  );

  if (station) {
    return station.StationName[getTdxLang(lang)];
  }

  return null;
};

/**
 * 取得 [台鐵] 車站 ID by 名稱
 * @param stationName
 * @param lang
 * @returns
 */
export const getTrStationIdByName = (
  stationName: string,
  lang: string,
): string => {
  if (!stationName || !lang) return null;

  const station = trStationDataList.find(
    (trStation) => trStation.StationName[getTdxLang(lang)] === stationName,
  );

  if (station) {
    return station.StationID;
  }

  return null;
};

/**
 * 取得 [高鐵] 車站名稱 by ID
 * @param stationId
 * @param lang
 * @returns
 */
export const getThsrStationNameById = (stationId: string, lang: string) => {
  if (!stationId || !lang) return null;

  const station = thsrStationDataList.find(
    (station) => station.StationID === stationId,
  );

  if (station) {
    return station.StationName[getTdxLang(lang)];
  }

  return null;
};

/**
 * 取得 [高鐵] 車站 ID by 名稱
 * @param stationName
 * @param lang
 * @returns
 */
export const getThsrStationIdByName = (stationName: string, lang: string) => {
  if (!stationName || !lang) return null;

  const station = thsrStationDataList.find(
    (station) => station.StationName[getTdxLang(lang)] === stationName,
  );

  if (station) {
    return station.StationID;
  }

  return null;
};

/**
 * 取得 [桃園捷運] 車站名稱 by ID
 * @param stationId
 * @param lang
 * @returns
 */
export const getTymcStationNameById = (stationId: string, lang: string) => {
  if (!stationId || !lang) return null;

  const station = tymcStationDataList.find(
    (station) => station.StationID === stationId,
  );

  if (station) {
    return `${station.StationID} ${station.StationName[getTdxLang(lang)]}`;
  }

  return null;
};

/**
 * 取得 [桃園捷運] 車站 ID by 名稱
 * @param stationName
 * @param lang
 * @returns
 */
export const getTymcStationIdByName = (stationName: string, lang: string) => {
  if (!stationName || !lang) return null;

  const station = tymcStationDataList.find(
    (station) => station.StationName[getTdxLang(lang)] === stationName,
  );

  if (station) {
    return `${station.StationID} ${station.StationName[getTdxLang(lang)]}`;
  }

  return null;
};

type RailPage = PageEnum.TR | PageEnum.THSR | PageEnum.TYMC;

/** 站號 → 本地站資料索引（首次使用時建立） */
let stationIndex: Record<
  RailPage,
  Map<string, { StationName: Record<"Zh_tw" | "En" | "Ja" | "Ko", string> }>
> | null = null;

const getStationIndex = () => {
  if (!stationIndex) {
    const toMap = <T extends { StationID: string }>(list: T[]) =>
      new Map(list.map((s) => [s.StationID, s]));
    stationIndex = {
      [PageEnum.TR]: toMap(trStationDataList),
      [PageEnum.THSR]: toMap(thsrStationDataList),
      [PageEnum.TYMC]: toMap(tymcStationDataList),
    };
  }
  return stationIndex;
};

/**
 * 取後端回傳站名的當前語系版本：
 * 中英直接用後端名稱；日韓依站號查本地站資料，查無時退回後端名稱（日文取中文、韓文取英文）
 */
export const getLocalizedStationName = (
  page: RailPage,
  stationId: string | undefined,
  name: JsyName | undefined,
  lang: string,
): string => {
  const fallback = name?.[getNameLangKey(lang)] ?? "";
  if (lang !== LocaleEnum.JA && lang !== LocaleEnum.KO) return fallback;
  const station = stationId
    ? getStationIndex()[page].get(stationId)
    : undefined;
  return station?.StationName[getTdxLang(lang)] ?? fallback;
};
