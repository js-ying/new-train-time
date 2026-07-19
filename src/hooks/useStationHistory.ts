import { StationSearchHistoryContext } from "@/contexts/StationSearchHistoryContext";
import {
  StationTarget,
  StationTrainType,
  StoredStationHistory,
} from "@/models/station-history";
import { useCallback, useContext } from "react";

/**
 * 通用單點查詢歷史 hook：依傳入車種（TR 單站 / BUS 路線）從 context 讀寫。
 * 與 OD useSearchHistory 不同：車種由呼叫頁面顯式指定（/station→TR、/bus→BUS），不靠 page 推導。
 */
export const useStationHistory = (trainType: StationTrainType) => {
  const { history, limit, saveHistory, clearHistory } = useContext(
    StationSearchHistoryContext,
  );

  const historyList: StoredStationHistory[] = history[trainType];

  const save = useCallback(
    (target: StationTarget) => saveHistory(trainType, target),
    [saveHistory, trainType],
  );

  const clear = useCallback(
    () => clearHistory(trainType),
    [clearHistory, trainType],
  );

  return { historyList, limit, saveHistory: save, clearHistory: clear };
};

export default useStationHistory;
