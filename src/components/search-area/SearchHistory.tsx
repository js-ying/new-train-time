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
        className="size-6"
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

/**
 * 歷史查詢（純時間序）。
 *
 * 註：常用路線（收藏）功能暫時隱藏，待與付費方案一起上線。
 * 原為「歷史查詢 / 常用路線」雙分頁 + 收藏愛心 + 設定預設分頁；
 * 完整版見 git 紀錄（feat: 常用路線 commit），還原時 revert 隱藏 commit 即可。
 */
const SearchHistory: FC = () => {
  const { t, i18n } = useTranslation();
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);

  const { page, isTymc } = usePage();
  const { isMobile } = useRwd();
  const onlyShowStationId = isTymc && isMobile;

  const { historyList, clearHistory, consumeLocalSaveFlag } =
    useSearchHistory();

  // 顯示快照：避免「按搜尋→導頁」前的重排閃動（靠 localSaveFlag 跳過）。
  const [displayHistory, setDisplayHistory] =
    useState<StoredHistoryInquiry[]>(historyList);
  useEffect(() => {
    if (consumeLocalSaveFlag()) return;
    setDisplayHistory(historyList);
  }, [historyList, consumeLocalSaveFlag]);

  const handleHistoryClick = (startStationId: string, endStationId: string) => {
    gaClickEvent(GaEnum.HISTORY);
    setParams({ ...params, startStationId, endStationId });
  };

  const handleClear = () => {
    clearHistory();
    setDisplayHistory([]);
  };

  // 單列站名按鈕
  const renderRow = (item: {
    startStationId: string;
    endStationId: string;
  }) => (
    <div
      className="relative"
      key={`${item.startStationId}-${item.endStationId}`}
    >
      <Button
        className="h-8 w-full min-w-fit bg-neutral-500 text-sm text-white dark:bg-neutral-600"
        size="sm"
        radius="sm"
        onPress={() =>
          handleHistoryClick(item.startStationId, item.endStationId)
        }
      >
        {onlyShowStationId ? (
          `${item.startStationId} ➔ ${item.endStationId}`
        ) : (
          <>
            {getStationNameById(page, item.startStationId, i18n.language)} ➔{" "}
            {getStationNameById(page, item.endStationId, i18n.language)}
          </>
        )}
      </Button>
    </div>
  );

  // 無歷史 → 整塊不顯示（導頁前不重排：靠 displayHistory 快照）
  if (displayHistory.length === 0) return null;

  return (
    <div className="text-center">
      {/* 歷史查詢標題：共 X / 5 筆 */}
      <div className="mb-2.5 text-sm text-zinc-500 dark:text-zinc-400">
        {t("historyInquiry", { nowLength: displayHistory.length })}
      </div>
      <div className="flex justify-center">
        <div className="flex flex-col gap-2.5">
          {displayHistory.map(renderRow)}
          {/* 清除歷史 */}
          <div className="flex justify-center">
            <CloseButton onClick={handleClear} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchHistory;
