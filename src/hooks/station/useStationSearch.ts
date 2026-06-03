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
import { useCallback, useContext } from "react";

// 排除非實體站（1001 = 環島之星列車起訖標記）。
// 搜尋與縣市瀏覽兩條路徑共用，避免只擋一邊造成入口不一致。
const EXCLUDED_STATION_IDS = ["1001"];

export const useStationSearch = () => {
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);

  /** 車站是否在指定縣市轄區內 (僅台鐵) — useCallback 穩定 identity，供清單 useMemo 與 React.memo 依賴 */
  const isStationBelowMainLine = useCallback(
    (trStationData: TrStationData, mainLine: string | null): boolean => {
      if (!mainLine) return false;
      if (EXCLUDED_STATION_IDS.includes(trStationData.StationID)) return false;
      return (
        trStationData.StationAddress.replace(/[0-9]/g, "").substring(0, 3) ===
        mainLine
      );
    },
    [],
  );

  /** 車站名稱是否符合輸入框內容 — useCallback 穩定 identity */
  const isStationNameIncludesInput = useCallback(
    (
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

      const excludeFilter = !EXCLUDED_STATION_IDS.includes(
        stationData.StationID,
      );

      return (enFilter || zhHantFilter || idFilter) && excludeFilter;
    },
    [],
  );

  /**
   * 處理車站選擇
   * 改用 functional setParams 讀取最新 prev，移除對當前 params 快照的依賴，
   * 讓本 callback identity 維持穩定，配合 StationButton 的 React.memo 才能真正 bail out。
   */
  const handleStationSelect = useCallback(
    (stationId: string): void => {
      setParams((prev) => {
        // 出發車站
        if (prev?.activeIndex === SearchAreaActiveIndexEnum.START_STATION) {
          return {
            ...prev,
            startStationId: stationId,
            activeIndex: SearchAreaActiveIndexEnum.EMPTY,
            layer: SearchAreaLayerEnum.FIRST_LAYER,
            inputValue: "",
          };
        }

        // 抵達車站
        if (prev?.activeIndex === SearchAreaActiveIndexEnum.END_STATION) {
          return {
            ...prev,
            endStationId: stationId,
            activeIndex: SearchAreaActiveIndexEnum.EMPTY,
            layer: SearchAreaLayerEnum.FIRST_LAYER,
            inputValue: "",
          };
        }

        return prev;
      });
    },
    [setParams],
  );

  return {
    params,
    setParams,
    isStationBelowMainLine,
    isStationNameIncludesInput,
    handleStationSelect,
  };
};
