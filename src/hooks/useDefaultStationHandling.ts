import { SearchAreaUpdateContext } from "@/contexts/SearchAreaContext";
import { PageEnum } from "@/enums/PageEnum";
import usePage from "@/hooks/usePage";
import useSearchHistory from "@/hooks/useSearchHistory";
import { useContext, useEffect } from "react";

/** 本次頁面載入中已帶入過預設車站的鐵路；整頁重新載入即重置 */
const filledPages = new Set<PageEnum>();

const useDefaultStationHandling = () => {
  const setParams = useContext(SearchAreaUpdateContext);
  const { page } = usePage();
  // historyList 為 newest-first，且已處理 legacy 格式與登入後的跨裝置同步
  const { historyList } = useSearchHistory();

  useEffect(() => {
    const latest = historyList[0];

    // 歷史尚未水合完成時先跳過，待載入後再帶入
    if (!latest || filledPages.has(page)) return;

    // 每條鐵路各帶入一次自己的最後查詢；已選好的站不覆蓋
    filledPages.add(page);
    setParams((prev) => ({
      ...prev,
      startStationId: prev.startStationId || latest.startStationId,
      endStationId: prev.endStationId || latest.endStationId,
    }));
  }, [historyList, page, setParams]);
};

export default useDefaultStationHandling;
