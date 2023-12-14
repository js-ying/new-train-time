import { PageEnum } from "../enums/Page";
import { trStationDataList } from "../public/data/stationsData";
import { getTdxLang } from "./locale-utils";

export const getStationNameById = (
  page: PageEnum,
  stationId: string,
  lang: string,
): string => {
  if (page === PageEnum.TR) {
    return getTrStationNameById(stationId, lang);
  }

  if (page === PageEnum.THSR) {
    return "";
  }

  return "";
};

export const getStationIdByName = (
  page: PageEnum,
  stationName: string,
  lang: string,
): string => {
  if (page === PageEnum.TR) {
    return getTrStationIdByName(stationName, lang);
  }

  if (page === PageEnum.THSR) {
    return "";
  }

  return "";
};

/**
 * 取得台鐵車站名稱
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
