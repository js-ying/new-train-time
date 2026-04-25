import {
  SearchAreaContext,
  SearchAreaUpdateContext,
} from "@/contexts/SearchAreaContext";
import usePage from "@/hooks/usePage";
import useParamsValidation from "@/hooks/useParamsValidation";
import useSearchHistory from "@/hooks/useSearchHistory";
import { Button } from "@heroui/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { FC, useContext, useState } from "react";
import CommonDialog from "../common/CommonDialog";

/** 搜尋按鈕 */
const SearchButton: FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);
  const { isParamsValid, validationAlert } = useParamsValidation();

  const { searchPath } = usePage();

  const [lastQueryTime, setLastQueryTime] = useState<number | null>(null);
  const queryInterval = 5000; // 5 seconds
  const { saveHistory } = useSearchHistory();

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

    saveHistory({
      startStationId: params.startStationId,
      endStationId: params.endStationId,
    });

    const isSameQuery =
      params.startStationId === router.query?.s &&
      params.endStationId === router.query?.e &&
      params.date === router.query?.d &&
      params.time.replace(":", "") === router.query?.t;

    if (isSameQuery) {
      if (lastQueryTime && Date.now() - lastQueryTime < queryInterval) {
        validationAlert.setMessage("sameQueryMsg");
        validationAlert.setOpen(true);
        return;
      }
      setLastQueryTime(Date.now());
      setParams((prev) => ({ ...prev, uuid: Date.now().toString() }));
    } else {
      router.push({
        pathname: searchPath,
        query: {
          s: params.startStationId,
          e: params.endStationId,
          d: params.date,
          t: params.time.replace(":", ""),
        },
      });
    }
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
          validationAlert.open &&
          validationAlert.message !== "datetimeNotAllowMsg"
        }
        setOpen={validationAlert.setOpen}
      >
        {t(validationAlert.message)}
      </CommonDialog>
    </>
  );
};

export default SearchButton;
