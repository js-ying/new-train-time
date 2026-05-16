import {
  SearchAreaContext,
  SearchAreaUpdateContext,
} from "@/contexts/SearchAreaContext";
import {
  SearchAreaActiveIndexEnum,
  SearchAreaLayerEnum,
} from "@/enums/SearchAreaParamsEnum";
import {
  ThsrStationData,
  TrStationData,
  TymcStationData,
} from "@/data/stationsData";
import { useContext } from "react";

// 排除非實體站（1001 = 環島之星列車起訖標記）。
// 搜尋與縣市瀏覽兩條路徑共用，避免只擋一邊造成入口不一致。
const EXCLUDED_STATION_IDS = ["1001"];

export const useStationSearch = () => {
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);

  /** 車站是否在指定縣市轄區內 (僅台鐵) */
  const isStationBelowMainLine = (
    trStationData: TrStationData,
    mainLine: string | null,
  ): boolean => {
    if (!mainLine) return false;
    if (EXCLUDED_STATION_IDS.includes(trStationData.StationID)) return false;
    return (
      trStationData.StationAddress.replace(/[0-9]/g, "").substring(0, 3) ===
      mainLine
    );
  };

  /** 車站名稱是否符合輸入框內容 */
  const isStationNameIncludesInput = (
    stationData: TrStationData | ThsrStationData | TymcStationData,
    inputValue: string,
  ): boolean => {
    const enFilter = stationData.StationName.En.toLowerCase().includes(
      inputValue.toLowerCase(),
    );

    const zhHantFilter =
      stationData.StationName.Zh_tw.includes(inputValue) ||
      stationData.StationName.Zh_tw.includes(inputValue.replace("台", "臺")) ||
      stationData.StationName.Zh_tw.includes(inputValue.replace("臺", "台"));

    const idFilter = stationData.StationID.includes(inputValue);

    const excludeFilter = !EXCLUDED_STATION_IDS.includes(stationData.StationID);

    return (enFilter || zhHantFilter || idFilter) && excludeFilter;
  };

  /** 處理車站選擇 */
  const handleStationSelect = (stationId: string): void => {
    // 出發車站
    if (params?.activeIndex === SearchAreaActiveIndexEnum.START_STATION) {
      setParams({
        ...params,
        startStationId: stationId,
        activeIndex: SearchAreaActiveIndexEnum.EMPTY,
        layer: SearchAreaLayerEnum.FIRST_LAYER,
        inputValue: "",
      });
    }

    // 抵達車站
    if (params?.activeIndex === SearchAreaActiveIndexEnum.END_STATION) {
      setParams({
        ...params,
        endStationId: stationId,
        activeIndex: SearchAreaActiveIndexEnum.EMPTY,
        layer: SearchAreaLayerEnum.FIRST_LAYER,
        inputValue: "",
      });
    }
  };

  return {
    params,
    setParams,
    isStationBelowMainLine,
    isStationNameIncludesInput,
    handleStationSelect,
  };
};
