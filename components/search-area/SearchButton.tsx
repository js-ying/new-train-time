import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { FC, useContext } from "react";
import { SearchAreaContext } from "../../contexts/SearchAreaContext";
import usePage from "../../hooks/usePageHook";
import useParamsValidation from "../../hooks/useParamsValidationHook";
import CommonDialog from "../CommonDialog";

export interface HistoryInquiry {
  startStationId: string;
  endStationId: string;
}

/** 搜尋按鈕 */
const SearchButton: FC = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const params = useContext(SearchAreaContext);
  const { isParamsValid, alertOptions } = useParamsValidation();

  const { localStorageKey, searchPath, page } = usePage();

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

  const handleSearch = () => {
    if (!isParamsValid(params.startStationId, params.endStationId, params.date))
      return;

    saveHistory({
      startStationId: params.startStationId,
      endStationId: params.endStationId,
    });

    router.push({
      pathname: searchPath,
      query: {
        s: params.startStationId,
        e: params.endStationId,
        d: params.date,
        t: params.time.replace(":", ""),
      },
    });
  };

  return (
    <>
      <button
        type="button"
        className="
            cursor-pointer rounded-md bg-zinc-700 px-4 py-2 text-white
            ring-zinc-400/70 transition duration-150 
            ease-out hover:bg-zinc-700/80 focus:ring
            dark:bg-grayBlue dark:ring-grayBlue/60 hover:dark:bg-grayBlue/80
            "
        onClick={() => handleSearch()}
      >
        {t("searchBtn")}
      </button>
      <CommonDialog
        open={alertOptions.alertOpen}
        setOpen={alertOptions.setAlertOpen}
        alertMsg={alertOptions.alertMsg}
      />
    </>
  );
};

export default SearchButton;
