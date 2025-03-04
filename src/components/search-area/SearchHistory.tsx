import {
  SearchAreaContext,
  SearchAreaUpdateContext,
} from "@/contexts/SearchAreaContext";
import { GaEnum } from "@/enums/GaEnum";
import usePage from "@/hooks/usePageHook";
import useRwd from "@/hooks/useRwdHook";
import { gaClickEvent } from "@/utils/GaUtils";
import { getStationNameById } from "@/utils/StationUtils";
import { Button } from "@heroui/react";
import { useTranslation } from "next-i18next";
import { FC, useContext, useEffect, useState } from "react";
import { HistoryInquiry } from "./SearchButton";

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
  const [historyList, setHistoryList] = useState<HistoryInquiry[]>([]);
  const { t, i18n } = useTranslation();
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);

  const { localStorageKey, page, isTymc } = usePage();
  const { isMobile } = useRwd();
  const onlyShowStationId = isTymc && isMobile;

  useEffect(() => {
    const valueString = window.localStorage.getItem(localStorageKey);
    if (valueString) {
      const value = JSON.parse(valueString);
      if (Array.isArray(value) && value.length > 0) {
        setHistoryList([...value].reverse());
      }
    }
  }, [localStorageKey]);

  const handleHistoryClick = (startStationId: string, endStationId: string) => {
    gaClickEvent(GaEnum.HISTORY);
    setParams({
      ...params,
      startStationId: startStationId,
      endStationId: endStationId,
    });
  };

  const clearHistoryList = () => {
    window.localStorage.setItem(localStorageKey, "[]");
    setHistoryList([]);
  };

  return (
    <div className="text-center">
      {historyList.length > 0 && (
        <div className="fade-in">
          <div className="mb-2.5 text-sm text-zinc-500 dark:text-zinc-400">
            {t("historyInquiry", { nowLength: historyList.length })}
          </div>
          <div className="flex justify-center">
            <div className="flex flex-col gap-2.5">
              {historyList.map((history) => {
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
                <CloseButton onClick={clearHistoryList} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchHistory;
