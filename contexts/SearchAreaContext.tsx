import { createContext, useEffect, useState } from "react";
import {
  SearchAreaActiveIndexEnum,
  SearchAreaLayerEnum,
} from "../enums/SearchAreaParamsEnum";
import DateUtils from "../utils/DateUtils";
export interface SearchAreaParams {
  startStationId: string;
  endStationId: string;
  date: string;
  time: string;
  activeIndex: SearchAreaActiveIndexEnum;
  // 目前只有台鐵的 SelectStation 才有分兩層，其餘皆為一層 (layer = 0)
  layer: SearchAreaLayerEnum;
  inputValue: string;
}

export const SearchAreaContext = createContext<SearchAreaParams>(null);
export const SearchAreaUpdateContext = createContext(null);

export function SearchAreaProvider({ children }) {
  const [searchAreaParams, setSearchAreaParams] = useState({
    startStationId: null,
    endStationId: null,
    date: null,
    time: null,
    activeIndex: SearchAreaActiveIndexEnum.EMPTY,
    layer: SearchAreaLayerEnum.FIRST_LAYER,
    inputValue: "",
  });

  useEffect(() => {
    setSearchAreaParams({
      ...searchAreaParams,
      date: DateUtils.getCurrentDate(),
      time: DateUtils.getCurrentTime(),
    });
  }, []);

  return (
    <SearchAreaContext.Provider value={searchAreaParams}>
      <SearchAreaUpdateContext.Provider value={setSearchAreaParams}>
        {children}
      </SearchAreaUpdateContext.Provider>
    </SearchAreaContext.Provider>
  );
}
