import {
  SettingContext,
  SettingParams,
  SettingUpdateContext,
} from "@/contexts/SettingContext";
import { useContext } from "react";

/**
 * 讀寫單一設定項目的 hook
 * 內部會同時更新 React state、localStorage，以及在登入時推送到 server（LWW）
 */
const useSetting = <K extends keyof SettingParams>(
  itemKey: K,
): [SettingParams[K], (val: SettingParams[K]) => void] => {
  const setting = useContext(SettingContext);
  const setValue = useContext(SettingUpdateContext);

  const updateValue = (value: SettingParams[K]) => {
    setValue(itemKey, value);
  };

  return [setting[itemKey], updateValue];
};

export default useSetting;
