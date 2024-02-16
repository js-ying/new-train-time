import { useTranslation } from "next-i18next";
import { FC, useContext, useEffect, useState } from "react";
import {
  SearchAreaContext,
  SearchAreaUpdateContext,
} from "../../contexts/SearchAreaContext";
import usePage from "../../hooks/usePageHook";
import { getStationNameById } from "../../utils/StationUtils";
import { HistoryInquiry } from "./SearchButton";

/** 關閉按鈕 */
const CloseButton: FC = () => {
  return (
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
  );
};

/** 歷史查詢 */
const SearchHistory: FC = () => {
  const [historyList, setHistoryList] = useState<HistoryInquiry[]>([]);
  const { t, i18n } = useTranslation();
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);

  const { localStorageKey, page } = usePage();

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
        <>
          <div className="mb-2.5 text-sm text-zinc-500 dark:text-zinc-400">
            {t("historyInquiry", { nowLength: historyList.length })}
          </div>
          <div className="flex justify-center">
            <div className="flex flex-col gap-2.5">
              {historyList.map((history) => {
                return (
                  <button
                    className="common-button px-2 py-1 text-sm"
                    key={`${history.startStationId}-${history.endStationId}`}
                    onClick={() =>
                      handleHistoryClick(
                        history.startStationId,
                        history.endStationId,
                      )
                    }
                  >
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
                  </button>
                );
              })}

              <div className="flex justify-center">
                <div
                  onClick={clearHistoryList}
                  className="cursor-pointer text-zinc-700 dark:text-zinc-200"
                >
                  <CloseButton />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchHistory;
