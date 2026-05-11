import {
  SearchAreaContext,
  SearchAreaUpdateContext,
} from "@/contexts/SearchAreaContext";
import useSearchMode from "@/hooks/search/useSearchMode";
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
  // 用 draftMode 寫入 URL：tab 切換僅改 draft，按搜尋這一刻才把選擇 commit 進 URL 並觸發 fetch
  const { draftMode } = useSearchMode();

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

    // mode 也要納入「是否同筆查詢」比對，否則 OD 不變但切 tab 後按搜尋會走 uuid 路徑而不更新 URL.m
    const currentUrlMode =
      router.query?.m === "transfer" ? "transfer" : "direct";
    const isSameQuery =
      params.startStationId === router.query?.s &&
      params.endStationId === router.query?.e &&
      params.date === router.query?.d &&
      params.time.replace(":", "") === router.query?.t &&
      draftMode === currentUrlMode;

    if (isSameQuery) {
      if (lastQueryTime && Date.now() - lastQueryTime < queryInterval) {
        validationAlert.setMessage("sameQueryMsg");
        validationAlert.setOpen(true);
        return;
      }
      setLastQueryTime(Date.now());
      setParams((prev) => ({ ...prev, uuid: Date.now().toString() }));
    } else {
      // mode=transfer 時保留 m 參數；direct 模式不寫 m，URL 維持乾淨
      router.push({
        pathname: searchPath,
        query: {
          s: params.startStationId,
          e: params.endStationId,
          d: params.date,
          t: params.time.replace(":", ""),
          ...(draftMode === "transfer" ? { m: "transfer" } : {}),
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
