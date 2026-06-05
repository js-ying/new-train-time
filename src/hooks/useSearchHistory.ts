import { SearchHistoryContext } from "@/contexts/SearchHistoryContext";
import { PageEnum } from "@/enums/PageEnum";
import { HistoryInquiry, StoredHistoryInquiry, TrainType } from "@/models/history";
import { useCallback, useContext } from "react";
import usePage from "./usePage";

/** 頁面 → 車種；非交通工具頁面（features/settings 等）回 undefined → 不參與歷史 */
const PAGE_TO_TRAIN_TYPE: Partial<Record<PageEnum, TrainType>> = {
  [PageEnum.TR]: "TR",
  [PageEnum.THSR]: "THSR",
  [PageEnum.TYMC]: "TYMC",
};

/**
 * 歷史查詢 hook：依當前頁面對應車種，從 SearchHistoryContext 讀寫。
 * - historyList：該車種歷史（已 newest-first，≤ 5 筆）
 * - saveHistory：新增一筆（登入會跨裝置同步）
 * - clearHistory：清除該車種歷史
 * - consumeLocalSaveFlag：讀後即清「上次變更是否本機存檔」旗標，供顯示層跳過按搜尋的重排
 */
export const useSearchHistory = () => {
  const { page } = usePage();
  const { history, saveHistory, clearHistory, consumeLocalSaveFlag } =
    useContext(SearchHistoryContext);
  const trainType = PAGE_TO_TRAIN_TYPE[page];

  const historyList: StoredHistoryInquiry[] = trainType
    ? history[trainType]
    : [];

  const save = useCallback(
    (inquiry: HistoryInquiry) => {
      if (!trainType) return;
      saveHistory(trainType, inquiry);
    },
    [saveHistory, trainType],
  );

  const clear = useCallback(() => {
    if (!trainType) return;
    clearHistory(trainType);
  }, [clearHistory, trainType]);

  return {
    historyList,
    saveHistory: save,
    clearHistory: clear,
    consumeLocalSaveFlag,
  };
};

export default useSearchHistory;
