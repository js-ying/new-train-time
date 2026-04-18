import { createContext, useEffect, useState } from "react";

export interface SettingParams {
  showTrTrainNote: boolean;
  showThsrTrainNote: boolean;
  autoRedirectLastUsedPage: boolean;
  mobileUseTrDirectBooking: boolean;
  mobileUseThsrDirectBooking: boolean;
  /** 是否顯示首頁熱門路線快查區塊 */
  showPopularRoutes: boolean;
}

export const defaultSetting: SettingParams = {
  showTrTrainNote: true,
  showThsrTrainNote: true,
  autoRedirectLastUsedPage: false,
  mobileUseTrDirectBooking: true,
  mobileUseThsrDirectBooking: true,
  /** 預設顯示熱門路線快查 */
  showPopularRoutes: true,
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
