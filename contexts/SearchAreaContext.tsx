import { createContext, useState } from "react";
import DateUtils from "../utils/date-utils";
export interface SearchAreaParams {
  startStation: string;
  endStation: string;
  date: string;
  time: string;
  activeIndex: number;
  // 目前只有台鐵的 SelectStation 才有分兩層，其餘皆為一層 (layer = 0)
  layer: number;
  inputValue: string;
}

export const SearchAreaContext = createContext<SearchAreaParams>(null);
export const SearchAreaUpdateContext = createContext(null);

export function SearchAreaProvider({ children }) {
  const [searchAreaParams, setSearchAreaParams] = useState({
    startStation: "1210",
    endStation: "1000",
    date: DateUtils.getCurrentDate(),
    time: DateUtils.getCurrentTime(),
    activeIndex: 0,
    layer: 0,
    inputValue: "",
  });

  return (
    <SearchAreaContext.Provider value={searchAreaParams}>
      <SearchAreaUpdateContext.Provider value={setSearchAreaParams}>
        {children}
      </SearchAreaUpdateContext.Provider>
    </SearchAreaContext.Provider>
  );
}
