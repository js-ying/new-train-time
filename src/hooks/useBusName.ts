import { useCallback } from "react";
import useLang from "./useLang";

/**
 * 公車顯示名選語系。
 *
 * @description 公車契約以平行 `xxxEn` 欄帶英文；英文非全滿，缺值一律退回中文。
 */
const useBusName = (): ((zh: string, en?: string) => string) => {
  const { isEn } = useLang();
  return useCallback(
    (zh: string, en?: string) => (isEn && en ? en : zh),
    [isEn],
  );
};

export default useBusName;
