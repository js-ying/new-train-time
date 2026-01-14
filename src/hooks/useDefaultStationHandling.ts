import {
  SearchAreaContext,
  SearchAreaUpdateContext,
} from "@/contexts/SearchAreaContext";
import usePage from "@/hooks/usePage";
import { HistoryInquiry } from "@/models/history";
import { useContext, useEffect } from "react";

const useDefaultStationHandling = () => {
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);
  const { localStorageKey } = usePage();

  useEffect(() => {
    const alreadyMountedKey = `alreadyMounted`;
    const alreadyMounted = localStorage.getItem(alreadyMountedKey);

    // 僅第一次載入時執行
    // 元件 re-mounted (切換 page 時) 也不執行
    if (!alreadyMounted || alreadyMounted === "false") {
      const valueString = window.localStorage.getItem(localStorageKey);
      if (valueString) {
        const value: HistoryInquiry[] = JSON.parse(valueString);
        if (Array.isArray(value) && value.length > 0) {
          setParams((prev) => ({
            ...prev,
            startStationId:
              prev.startStationId || value[value.length - 1].startStationId,
            endStationId:
              prev.endStationId || value[value.length - 1].endStationId,
          }));
        }
      }

      // 設定 localStorage，表示已經執行過
      localStorage.setItem(alreadyMountedKey, "true");

      // 關閉瀏覽器分頁時，刪除 localStorage 中的值，以便下次進入此系統時可預設車站
      window.addEventListener("beforeunload", () => {
        localStorage.setItem(alreadyMountedKey, "false");
      });
    }
  }, []);
};

export default useDefaultStationHandling;
