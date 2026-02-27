import { HistoryInquiry } from "@/models/history";
import usePage from "./usePage";

export const useSearchHistory = () => {
  const { localStorageKey } = usePage();

  const saveHistory = ({ startStationId, endStationId }: HistoryInquiry) => {
    let historyList: HistoryInquiry[] = [];
    const valueString = window.localStorage.getItem(localStorageKey);
    if (valueString) {
      const value = JSON.parse(valueString);
      if (Array.isArray(value) && value.length > 0) {
        historyList = value;
      }
    }

    let hasDuplicate = false;
    let duplicateIndex;
    if (historyList.length > 0) {
      historyList.forEach((history, index) => {
        if (
          JSON.stringify(history) ===
          JSON.stringify({ startStationId, endStationId })
        ) {
          hasDuplicate = true;
          duplicateIndex = index;
        }
      });
    }

    if (hasDuplicate) {
      historyList.splice(duplicateIndex, 1);
    }

    historyList.push({ startStationId, endStationId });

    if (historyList.length > 5) {
      historyList.shift();
    }

    window.localStorage.setItem(localStorageKey, JSON.stringify(historyList));
  };

  return { saveHistory };
};

export default useSearchHistory;
