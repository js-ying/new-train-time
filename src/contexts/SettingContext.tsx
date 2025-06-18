import { createContext, useEffect, useState } from "react";

export interface SettingParams {
  showTrTrainNote: boolean;
  autoRedirectLastUsedPage: boolean;
}

export const defaultSetting: SettingParams = {
  showTrTrainNote: false,
  autoRedirectLastUsedPage: true,
};

export const SettingContext = createContext<SettingParams>(null);
export const SettingUpdateContext = createContext(null);

export function SettingProvider({ children }) {
  const [searchAreaParams, setSettingParams] =
    useState<SettingParams>(defaultSetting);

  useEffect(() => {
    const newSettings: SettingParams = { ...defaultSetting };

    Object.entries(defaultSetting).forEach(([key, defaultVal]) => {
      const val = localStorage.getItem(key);
      console.log(key, val);
      if (val === null) {
        // 如果 localStorage 沒有，就補上預設值
        localStorage.setItem(key, defaultVal.toString());
      } else {
        newSettings[key] = val === "true";
      }
    });

    setSettingParams(newSettings);
  }, []);

  return (
    <SettingContext.Provider value={searchAreaParams}>
      <SettingUpdateContext.Provider value={setSettingParams}>
        {children}
      </SettingUpdateContext.Provider>
    </SettingContext.Provider>
  );
}
