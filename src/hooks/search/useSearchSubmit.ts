import {
  SearchAreaContext,
  SearchAreaUpdateContext,
} from "@/contexts/SearchAreaContext";
import { SubmitOverrides, SubmitSearch } from "@/contexts/SearchSubmitContext";
import useSearchMode from "@/hooks/search/useSearchMode";
import usePage from "@/hooks/usePage";
import useParamsValidation, {
  ValidationAlert,
} from "@/hooks/useParamsValidation";
import useSearchHistory from "@/hooks/useSearchHistory";
import { useRouter } from "next/router";
import { useContext, useState } from "react";

interface UseSearchSubmitResult {
  submitSearch: SubmitSearch;
  validationAlert: ValidationAlert;
  /** 被同筆查詢節流擋下當下凍結的剩餘秒數 */
  sameQuerySeconds: number;
}

const QUERY_INTERVAL = 5000;

/**
 * 送出搜尋：驗證 → 存查詢歷史 → 導頁；URL 與上次相同時改更新 uuid 強制重查。
 * 由 SearchArea 呼叫一次後經 SearchSubmitContext 下放，節流與提示狀態全畫面共用一份。
 */
const useSearchSubmit = (): UseSearchSubmitResult => {
  const router = useRouter();
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);
  const { isParamsValid, validationAlert } = useParamsValidation();
  // 用 draftMode 寫入 URL：tab 切換僅改 draft，送出這一刻才把選擇 commit 進 URL 並觸發 fetch
  const { draftMode } = useSearchMode();
  const { searchPath } = usePage();
  const { saveHistory } = useSearchHistory();

  const [lastQueryTime, setLastQueryTime] = useState<number | null>(null);
  // 被擋下當下凍結的剩餘秒數（不即時倒數，提示維持顯示這個數字）
  const [sameQuerySeconds, setSameQuerySeconds] = useState(0);

  const submitSearch = (overrides?: SubmitOverrides) => {
    const date = overrides?.date ?? params.date;
    const time = overrides?.time ?? params.time;

    const { isValid, isDateInValid } = isParamsValid(
      params.startStationId,
      params.endStationId,
      date,
      time,
    );

    if (!isValid) {
      // 檢核失敗，且非日期錯誤，則不予查詢
      if (!isDateInValid) return;

      // 檢核失敗，且是日期錯誤，直接導頁，由 search 頁面處理
    }

    saveHistory({
      startStationId: params.startStationId,
      endStationId: params.endStationId,
    });

    // mode 也要納入「是否同筆查詢」比對，否則 OD 不變但切 tab 後按搜尋會走 uuid 路徑而不更新 URL.m
    const currentUrlMode =
      router.query?.m === "transfer" ? "transfer" : "direct";
    const isSameQuery =
      params.startStationId === router.query?.s &&
      params.endStationId === router.query?.e &&
      date === router.query?.d &&
      time.replace(":", "") === router.query?.t &&
      draftMode === currentUrlMode;

    if (isSameQuery) {
      if (lastQueryTime && Date.now() - lastQueryTime < QUERY_INTERVAL) {
        // 凍結被擋當下的剩餘秒數（無條件進位，至少 1 秒）
        setSameQuerySeconds(
          Math.max(
            1,
            Math.ceil((lastQueryTime + QUERY_INTERVAL - Date.now()) / 1000),
          ),
        );
        validationAlert.setMessage("sameQueryMsg");
        validationAlert.setOpen(true);
        return;
      }
      setLastQueryTime(Date.now());
      setParams((prev) => ({ ...prev, uuid: Date.now().toString() }));
    } else {
      // mode=transfer 時保留 m 參數；direct 模式不寫 m，URL 維持乾淨
      router.push({
        pathname: searchPath,
        query: {
          s: params.startStationId,
          e: params.endStationId,
          d: date,
          t: time.replace(":", ""),
          ...(draftMode === "transfer" ? { m: "transfer" } : {}),
        },
      });
    }
  };

  return { submitSearch, validationAlert, sameQuerySeconds };
};

export default useSearchSubmit;
