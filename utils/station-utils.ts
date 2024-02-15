import { PageEnum } from "../enums/PageEnum";
import {
  thsrStationDataList,
  trStationDataList,
} from "../public/data/stationsData";
import { getTdxLang } from "./locale-utils";

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
