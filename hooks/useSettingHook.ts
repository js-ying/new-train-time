import { useContext, useState } from "react";
import {
  SettingContext,
  SettingUpdateContext,
} from "../contexts/SettingContext";

const useSettingHook = (itemKey: string): [boolean, (val: boolean) => void] => {
  const setting = useContext(SettingContext);
  const setSetting = useContext(SettingUpdateContext);

  const [storedValue, setStoredValue] = useState<boolean>(setting[itemKey]);

  const updateValue = (value: boolean) => {
    localStorage.setItem(itemKey, value.toString());
    setStoredValue(value);
    setSetting({ ...setting, [itemKey]: value });
  };

  return [storedValue, updateValue];
};

export default useSettingHook;
