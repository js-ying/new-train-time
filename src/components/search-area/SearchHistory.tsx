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
import { FC, useContext, useEffect, useRef, useState } from "react";

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
  const { historyList, clearHistory } = useSearchHistory();

  // 顯示用定格快照：水合拿到資料後定格，避免本頁按搜尋／回填造成清單在「跳轉前」即時重排閃動。
  // 離開首頁→搜尋頁時本元件會 unmount，返回首頁重新 mount 即自然取得最新順序。
  const [displayList, setDisplayList] = useState<StoredHistoryInquiry[]>([]);
  const frozenRef = useRef(false);

  useEffect(() => {
    if (frozenRef.current) return;
    // 清單尚空時持續跟隨（涵蓋水合前的空狀態與登入合併）；一旦有資料就定格
    setDisplayList(historyList);
    if (historyList.length > 0) frozenRef.current = true;
  }, [historyList]);

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
                        →{" "}
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
