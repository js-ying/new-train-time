import { SearchAreaContext } from "@/contexts/SearchAreaContext";
import usePage from "@/hooks/usePageHook";
import useParamsValidation from "@/hooks/useParamsValidationHook";
import { Button } from "@heroui/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { FC, useContext } from "react";
import CommonDialog from "../CommonDialog";

export interface HistoryInquiry {
  startStationId: string;
  endStationId: string;
}

/** 搜尋按鈕 */
const SearchButton: FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useContext(SearchAreaContext);
  const { isParamsValid, alertOptions } = useParamsValidation();

  const { localStorageKey, searchPath } = usePage();

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
    const { isValid, isDateInValid } = isParamsValid(
      params.startStationId,
      params.endStationId,
      params.date,
      params.time,
    );

    if (!isValid) {
      // 檢核失敗，且非日期錯誤，則不予查詢
      if (!isDateInValid) return;

      // 檢核失敗，且是日期錯誤，直接導頁，由 search 頁面處理
    }

    if (
      params.startStationId === router.query?.s &&
      params.endStationId === router.query?.e &&
      params.date === router.query?.d &&
      params.time.replace(":", "") === router.query?.t
    ) {
      alertOptions.setAlertMsg("sameQueryMsg");
      alertOptions.setAlertOpen(true);
      return;
    }

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
      <Button
        className="text-md h-10 min-w-fit bg-zinc-700 text-white dark:bg-silverLakeBlue-500"
        radius="sm"
        onPress={() => handleSearch()}
      >
        {t("searchBtn")}
      </Button>

      {/* 搜尋元件不處理日期錯誤彈窗，直接由導頁後的 search 頁面顯示彈窗 */}
      <CommonDialog
        open={
          alertOptions.alertOpen &&
          alertOptions.alertMsg !== "datetimeNotAllowMsg"
        }
        setOpen={alertOptions.setAlertOpen}
      >
        {t(alertOptions.alertMsg)}
      </CommonDialog>
    </>
  );
};

export default SearchButton;
