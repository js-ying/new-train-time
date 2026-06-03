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
import { useRouter } from "next/router";
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

  const router = useRouter();

  // 顯示用快照：平時跟隨 context（涵蓋水合、登入同步、跨裝置/跨分頁收斂與清除，皆即時反映）。
  // 僅在「導頁進行中」暫時凍結，避免按搜尋造成清單在跳轉前即時重排閃動：
  //   - routeChangeStart 在 router.push 當下同步觸發，早於 saveHistory 的 state flush，故能擋住重排。
  //   - 導去搜尋頁（pathname 改變）會 unmount 本元件，下方 cleanup 移除監聽，凍結隨之消失。
  //   - 同頁導航（語系切換 router.replace、shallow）不會 unmount，故 routeChangeComplete/Error
  //     必須解凍並重新對齊 historyList，否則畫面會被永久凍住而漏掉之後的同步更新。
  const [displayList, setDisplayList] = useState<StoredHistoryInquiry[]>([]);
  const frozenRef = useRef(false);

  useEffect(() => {
    if (frozenRef.current) return;
    setDisplayList(historyList);
  }, [historyList]);

  useEffect(() => {
    const freeze = () => {
      frozenRef.current = true;
    };
    const unfreeze = () => {
      frozenRef.current = false;
      setDisplayList(historyList);
    };
    router.events.on("routeChangeStart", freeze);
    router.events.on("routeChangeComplete", unfreeze);
    router.events.on("routeChangeError", unfreeze);
    return () => {
      router.events.off("routeChangeStart", freeze);
      router.events.off("routeChangeComplete", unfreeze);
      router.events.off("routeChangeError", unfreeze);
    };
  }, [router.events, historyList]);

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
