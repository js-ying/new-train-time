import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { SearchAreaContext } from "../contexts/SearchAreaContext";
import { getTrStationNameById } from "../utils/station-utils";
import DateUtils from "../utils/date-utils";
import CommonDialog from "./CommonDialog";
import { PathEnum } from "../enums/Path";
import { PageEnum } from "../enums/Page";

export interface HistoryInquiry {
  startStationId: string;
  endStationId: string;
}

const SearchButton = ({ page }) => {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const params = useContext(SearchAreaContext);
  const [open, setOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);
  const localStorageKey = `${page}HistoryList`;

  const isParamsValid = (
    startStationId: string,
    endStationId: string,
    date: string,
  ) => {
    if (!startStationId && !endStationId) {
      setAlertMsg("bothStationAreBlank");
      setOpen(true);
      return false;
    }

    if (startStationId === endStationId) {
      setAlertMsg("sameStation");
      setOpen(true);
      return false;
    }

    if (
      DateUtils.isBefore(date, DateUtils.getCurrentDate()) ||
      DateUtils.isAfter(date, DateUtils.addMonth(DateUtils.getCurrentDate(), 2))
    ) {
      setAlertMsg("datetimeNotAllow");
      setOpen(true);
      return false;
    }

    return true;
  };

  const saveHistoryListToLocalStorage = ({
    startStationId,
    endStationId,
  }: HistoryInquiry) => {
    let historyList: HistoryInquiry[] = [];
    const valueString = window.localStorage.getItem(localStorageKey);
    if (valueString) {
      const value = JSON.parse(valueString);
      if (Array.isArray(value) && value.length > 0) {
        historyList = value;
      }
    }

    if (historyList.length > 4) {
      historyList.shift();
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

    window.localStorage.setItem(localStorageKey, JSON.stringify(historyList));
  };

  const handleSearch = () => {
    if (!isParamsValid(params.startStationId, params.endStationId, params.date))
      return;

    saveHistoryListToLocalStorage({
      startStationId: params.startStationId,
      endStationId: params.endStationId,
    });

    router.push({
      pathname: `${PathEnum[page + "Search"]}`,
      query: {
        s: getTrStationNameById(params.startStationId, i18n.language),
        e: getTrStationNameById(params.endStationId, i18n.language),
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
            transition duration-150 ease-out 
            hover:bg-zinc-700/80 dark:bg-grayBlue hover:dark:bg-grayBlue/80
            "
        onClick={() => handleSearch()}
      >
        {t("searchBtn")}
      </button>
      <CommonDialog open={open} setOpen={setOpen} alertMsg={alertMsg} />
    </>
  );
};

export default SearchButton;
