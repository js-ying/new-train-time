import {
  SettingContext,
  SettingParams,
  SettingUpdateContext,
} from "@/contexts/SettingContext";
import { useContext } from "react";

const useSettingHook = (
  itemKey: keyof SettingParams,
): [boolean, (val: boolean) => void] => {
  const setting = useContext(SettingContext);
  const setSetting = useContext(SettingUpdateContext);

  const updateValue = (value: boolean) => {
    localStorage.setItem(itemKey, value.toString());
    setSetting((prev) => ({ ...prev, [itemKey]: value }));
  };

  return [setting[itemKey], updateValue];
};

export default useSettingHook;
