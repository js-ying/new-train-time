import { PageEnum } from "@/enums/PageEnum";
import {
  thsrStationDataList,
  TrStationData,
  trStationDataList,
  tymcStationDataList,
} from "@/data/stationsData";
import { getTdxLang } from "./LocaleUtils";

// 環島之星列車起訖標記，非實體車站，一律排除
const EXCLUDED_STATION_IDS = ["1001"];

/** 把「台」「臺」視為同字（全域替換，供站名比對；前後端篩選須一致） */
export const normalizeTaiTai = (s: string): string => s.replace(/台/g, "臺");

/** 是否為有效台鐵站號（存在且非環島標記站） */
export const isValidTrStationId = (stationId: string): boolean =>
  !!stationId &&
  !EXCLUDED_STATION_IDS.includes(stationId) &&
  trStationDataList.some((s) => s.StationID === stationId);

/** 站名是否符合輸入（En / Zh / 站號比對，台↔臺同字） */
export const isTrStationMatchInput = (
  station: TrStationData,
  input: string,
): boolean => {
  if (EXCLUDED_STATION_IDS.includes(station.StationID)) return false;
  if (!input) return true;
  const enMatch = station.StationName.En.toLowerCase().includes(
    input.toLowerCase(),
  );
  const zhMatch = normalizeTaiTai(station.StationName.Zh_tw).includes(
    normalizeTaiTai(input),
  );
  const idMatch = station.StationID.includes(input);
  return enMatch || zhMatch || idMatch;
};

/** 站是否屬指定縣市（以地址前三字比對，沿用既有 picker 縣市分層規則） */
export const isTrStationInCounty = (
  station: TrStationData,
  county: string,
): boolean => {
  if (!county || EXCLUDED_STATION_IDS.includes(station.StationID)) return false;
  return (
    station.StationAddress.replace(/[0-9]/g, "").substring(0, 3) === county
  );
};

/** 由經緯度取最近的台鐵車站站號（haversine 角距）；找不到回 null */
export const getNearestTrStation = (lat: number, lon: number): string | null => {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  let nearestId: string | null = null;
  let minDist = Infinity;
  for (const s of trStationDataList) {
    if (EXCLUDED_STATION_IDS.includes(s.StationID)) continue;
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

/**
 * 取得車站名稱 by ID
 * @param page
 * @param stationId
 * @param lang
 * @returns
 */
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

/**
 * 取得車站 ID by 名稱
 * @param page
 * @param stationName
 * @param lang
 * @returns
 */
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
