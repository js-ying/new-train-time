import { useCallback } from "react";
import useLang from "./useLang";

/**
 * 公車顯示名選語系。
 *
 * @description 公車契約以平行 `xxxEn` 欄帶英文；英文、韓文介面取英文，其餘取中文；英文非全滿，缺值一律退回中文。
 */
const useBusName = (): ((zh: string, en?: string) => string) => {
  const { usesEnglishNames } = useLang();
  return useCallback(
    (zh: string, en?: string) => (usesEnglishNames && en ? en : zh),
    [usesEnglishNames],
  );
};

export default useBusName;
