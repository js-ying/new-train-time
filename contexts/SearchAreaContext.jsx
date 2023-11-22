import { createContext, useState } from "react";

export const SearchAreaContext = createContext(null);
export const SearchAreaUpdateContext = createContext(null);

export function SearchAreaProvider({ children }) {
  const [searchAreaParams, setSearchAreaParams] = useState({
    startStation: "台北",
    endStation: "新竹",
    datetime: "2023-11-23",
    activeIndex: 0,
  });

  return (
    <SearchAreaContext.Provider value={searchAreaParams}>
      <SearchAreaUpdateContext.Provider value={setSearchAreaParams}>
        {children}
      </SearchAreaUpdateContext.Provider>
    </SearchAreaContext.Provider>
  );
}
