import { createContext, useState } from "react";

export interface SearchAreaParams {
  startStation: string;
  endStation: string;
  datetime: string;
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
    datetime: "2023-11-23",
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
