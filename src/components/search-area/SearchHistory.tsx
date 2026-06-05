import {
  SearchAreaContext,
  SearchAreaUpdateContext,
} from "@/contexts/SearchAreaContext";
import { GaEnum } from "@/enums/GaEnum";
import usePage from "@/hooks/usePage";
import useRwd from "@/hooks/useRwd";
import useSearchHistory from "@/hooks/useSearchHistory";
import { StoredHistoryInquiry } from "@/models/history";
import { gaClickEvent } from "@/utils/GaUtils";
import { getStationNameById } from "@/utils/StationUtils";
import { Button } from "@heroui/react";
import { useTranslation } from "next-i18next";
import { FC, useContext, useEffect, useState } from "react";

interface CloseButtonProps {
  onClick: () => void;
}

/** 關閉按鈕 */
const CloseButton: FC<CloseButtonProps> = ({ onClick }) => {
  return (
    <Button
      size="sm"
      variant="light"
      className="min-w-fit px-0 text-zinc-700 dark:text-zinc-200 sm:px-1.5"
      onPress={onClick}
      aria-label="close-btn"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </Button>
  );
};

/** 歷史查詢 */
const SearchHistory: FC = () => {
  const { t, i18n } = useTranslation();
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);

  const { page, isTymc } = usePage();
  const { isMobile } = useRwd();
  const onlyShowStationId = isTymc && isMobile;

  // 歷史清單由 SearchHistoryContext 統一管理（含跨裝置同步），已 newest-first
  const { historyList, clearHistory, consumeLocalSaveFlag } = useSearchHistory();

  // 顯示用快照：平時即時跟隨 context（水合、登入/跨裝置同步、跨分頁收斂與清除皆反映）。
  // 初值直接取 historyList（而非 []）：SearchHistoryProvider 掛在 _app，切換鐵路系統會 remount 本
  // 元件但 context 早已水合，故 mount 當下 historyList 已是該車種清單；若初值為 [] 則第一次 paint 必為空、
  // 要等下方 useEffect 於繪製後才補上，造成「空→出現」閃爍（切換 TR/THSR/TYMC 時最明顯）。
  // SSR 與首次載入時 provider 尚為 emptyMap，historyList=[] 與 server 輸出一致，不會 hydration mismatch。
  const [displayList, setDisplayList] = useState<StoredHistoryInquiry[]>(historyList);

  // 唯一例外：跳過「本機 saveHistory 觸發」的那一次重排。按搜尋會先 saveHistory（把該 OD 移到頂）
  // 再 router.push 導頁；若把重排畫出來，會在跳轉前一瞬閃動。改以 context 的本機存檔旗標精準判別
  // 變更來源——而非賭 routeChangeStart 早於 React 的 effect flush（該時序在 Next 14 並不保證，
  // 正是舊版 router.events freeze 失效的原因）。讀到旗標即略過本次更新、displayList 維持原序，
  // 元件隨後因導頁 unmount；其餘來源旗標為 false，照常即時反映。
  useEffect(() => {
    if (consumeLocalSaveFlag()) return;
    setDisplayList(historyList);
  }, [historyList, consumeLocalSaveFlag]);

  const handleHistoryClick = (startStationId: string, endStationId: string) => {
    gaClickEvent(GaEnum.HISTORY);
    setParams({
      ...params,
      startStationId: startStationId,
      endStationId: endStationId,
    });
  };

  // 清除為本頁明確操作，需即時反映：同步清 context（含 server）並清空顯示快照
  const handleClear = () => {
    clearHistory();
    setDisplayList([]);
  };

  return (
    <>
      {displayList.length > 0 && (
        <div className="text-center">
          <div className="mb-2.5 text-sm text-zinc-500 dark:text-zinc-400">
            {t("historyInquiry", { nowLength: displayList.length })}
          </div>
          <div className="flex justify-center">
            <div className="flex flex-col gap-2.5">
              {displayList.map((history) => {
                return (
                  <Button
                    className="h-8 min-w-fit bg-neutral-500 text-sm text-white dark:bg-neutral-600"
                    size="sm"
                    radius="sm"
                    onPress={() =>
                      handleHistoryClick(
                        history.startStationId,
                        history.endStationId,
                      )
                    }
                    key={`${history.startStationId}-${history.endStationId}`}
                  >
                    {onlyShowStationId ? (
                      `${history.startStationId} → ${history.endStationId}`
                    ) : (
                      <>
                        {getStationNameById(
                          page,
                          history.startStationId,
                          i18n.language,
                        )}{" "}
                        ➔{" "}
                        {getStationNameById(
                          page,
                          history.endStationId,
                          i18n.language,
                        )}
                      </>
                    )}
                  </Button>
                );
              })}

              <div className="flex justify-center">
                <CloseButton onClick={handleClear} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchHistory;
