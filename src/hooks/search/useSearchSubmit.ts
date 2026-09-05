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
import useRefreshCooldown, {
  QUERY_COOLDOWN_MS,
  UseRefreshCooldownResult,
} from "@/hooks/useRefreshCooldown";
import useSearchHistory from "@/hooks/useSearchHistory";
import { useRouter } from "next/router";
import { useContext } from "react";

interface UseSearchSubmitResult {
  submitSearch: SubmitSearch;
  validationAlert: ValidationAlert;
  /** 同筆查詢節流（搜尋鈕與「現在」共用一份），冷卻提示彈窗由 SearchArea 渲染 */
  cooldown: UseRefreshCooldownResult;
}

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
  const cooldown = useRefreshCooldown(QUERY_COOLDOWN_MS);

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

    // 冷卻 key＝這次要送出的查詢；改任一欄位即視為新查詢，不受上一筆冷卻影響
    const queryKey = `${params.startStationId}|${params.endStationId}|${date}|${time}|${draftMode}`;

    cooldown.attempt(
      () => {
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

        // URL 不變時 router.push 不會觸發重抓，改換 uuid 讓查詢 effect 重跑
        if (isSameQuery) {
          setParams((prev) => ({ ...prev, uuid: Date.now().toString() }));
          return;
        }

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
      },
      { key: queryKey },
    );
  };

  return { submitSearch, validationAlert, cooldown };
};

export default useSearchSubmit;
