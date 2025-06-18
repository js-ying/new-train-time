import { createContext, useEffect, useState } from "react";

export interface SettingParams {
  showTrTrainNote: boolean;
  autoRedirectLastUsedPage: boolean;
}

export const SettingContext = createContext<SettingParams>(null);
export const SettingUpdateContext = createContext(null);

export function SettingProvider({ children }) {
  const [searchAreaParams, setSettingParams] = useState({
    showTrTrainNote: false,
    autoRedirectLastUsedPage: true,
  });

  useEffect(() => {
    setSettingParams({
      ...searchAreaParams,
      showTrTrainNote: localStorage.getItem("showTrTrainNote") === "true",
      autoRedirectLastUsedPage:
        localStorage.getItem("autoRedirectLastUsedPage") === "true",
    });
  }, []);

  return (
    <SettingContext.Provider value={searchAreaParams}>
      <SettingUpdateContext.Provider value={setSettingParams}>
        {children}
      </SettingUpdateContext.Provider>
    </SettingContext.Provider>
  );
}
