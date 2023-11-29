import { trStationDataList } from "../public/data/stationsData";
import { getTdxLang } from "./locale-utils";

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
  const station = trStationDataList.find(
    (trStation) => trStation.StationID === stationId,
  );

  if (station) {
    return station.StationName[getTdxLang(lang)];
  }

  return null;
};
