import { GaEnum } from "@/enums/GaEnum";
import { SearchAreaActiveIndexEnum } from "@/enums/SearchAreaParamsEnum";
import useSearchMode from "@/hooks/search/useSearchMode";
import { useSearchAreaNavigation } from "@/hooks/station/useSearchAreaNavigation";
import useDefaultStationHandling from "@/hooks/useDefaultStationHandling";
import usePage from "@/hooks/usePage";
import useRwd from "@/hooks/useRwd";
import { gaClickEvent } from "@/utils/GaUtils";
import { getStationNameById } from "@/utils/StationUtils";
import { Tab, Tabs } from "@heroui/react";
import dynamic from "next/dynamic";
import { useTranslation } from "next-i18next";
import { FC } from "react";
import Area from "./Area";
import SearchButton from "./SearchButton";
import SelectStation from "./SelectStation";
import SwitchButton from "./SwitchButton";

/**
 * 日期 / 時間選擇器改用 dynamic import 延遲載入。
 * 內含 @mui/x-date-pickers + dayjs locale（首頁初始並用不到），抽出後不再打進首屏 bundle，
 * 僅在使用者點「日期」分頁時才載入；ssr:false 因為涉及客戶端時區 / 語系。
 * loading 佔位高度比照實際元件（DateCalendar≈320×336 + TimePicker），維持 CLS 0。
 */
const SelectDatetime = dynamic(() => import("./SelectDatetime"), {
  ssr: false,
  loading: () => (
    <div className="flex select-none flex-col">
      <div className="h-[336px] w-80 rounded-md border border-zinc-300 dark:border-zinc-500" />
      <div className="mt-2 h-10" />
    </div>
  ),
});

/** 搜尋區域 */
const SearchArea: FC = () => {
  const { t, i18n } = useTranslation();
  const { page, isTr, isTymc } = usePage();
  const { isMobile } = useRwd();
  const { params, handleStationAreaClick } = useSearchAreaNavigation();
  // Tab 切換只改 draftMode（不觸發 fetch / URL 變更）；按搜尋按鈕才會把 draftMode 帶到 URL
  const { draftMode, setDraftMode } = useSearchMode();
  const onlyShowStationId = isTymc && isMobile;

  // 處理預設車站
  useDefaultStationHandling();

  return (
    <>
      <div className="flex items-center gap-3">
        <Area
          className="flex-1"
          isActive={
            params.activeIndex === SearchAreaActiveIndexEnum.START_STATION
          }
          onClick={() =>
            handleStationAreaClick(
              SearchAreaActiveIndexEnum.START_STATION,
              params.activeIndex,
            )
          }
        >
          {t("startStation")}
          {onlyShowStationId ? (
            <div>{params.startStationId}</div>
          ) : (
            <div>
              {getStationNameById(page, params.startStationId, i18n.language)}
            </div>
          )}
        </Area>
        <SwitchButton />
        <Area
          className="flex-1"
          isActive={
            params.activeIndex === SearchAreaActiveIndexEnum.END_STATION
          }
          onClick={() =>
            handleStationAreaClick(
              SearchAreaActiveIndexEnum.END_STATION,
              params.activeIndex,
            )
          }
        >
          {t("endStation")}
          {onlyShowStationId ? (
            <div>{params.endStationId}</div>
          ) : (
            <div>
              {getStationNameById(page, params.endStationId, i18n.language)}
            </div>
          )}
        </Area>
        <Area
          className="ml-6 hidden flex-1 md:flex"
          isActive={params.activeIndex === SearchAreaActiveIndexEnum.DATE_TIME}
          onClick={() =>
            handleStationAreaClick(
              SearchAreaActiveIndexEnum.DATE_TIME,
              params.activeIndex,
            )
          }
        >
          {t("datetime")}
          <div>
            {params.date} {params.time}
          </div>
        </Area>
      </div>
      <div className="mt-4 flex md:hidden">
        <Area
          className="flex-1"
          isActive={params.activeIndex === SearchAreaActiveIndexEnum.DATE_TIME}
          onClick={() =>
            handleStationAreaClick(
              SearchAreaActiveIndexEnum.DATE_TIME,
              params.activeIndex,
            )
          }
        >
          {t("datetime")}
          <div suppressHydrationWarning>
            {params.date} {params.time}
          </div>
        </Area>
      </div>
      <div className="mt-6 empty:hidden">
        {(params.activeIndex === SearchAreaActiveIndexEnum.START_STATION ||
          params.activeIndex === SearchAreaActiveIndexEnum.END_STATION) && (
          <SelectStation />
        )}
        {params.activeIndex === SearchAreaActiveIndexEnum.DATE_TIME && (
          <div className="flex justify-center">
            <SelectDatetime />
          </div>
        )}
      </div>
      {/* 直達 / 轉乘模式切換 — 僅台鐵頁支援轉乘；放在搜尋按鈕上方 */}
      {isTr && (
        <div className="-mb-2 mt-4 flex justify-center">
          <Tabs
            variant="solid"
            radius="full"
            size="md"
            classNames={{
              tabList: "!bg-transparent",
              cursor:
                "!bg-transparent !border border-zinc-700 dark:!border-zinc-200 !shadow-none",
              // 取消 HeroUI 預設 hover-unselected 變透明 (opacity-disabled)，只讓字變亮（不加背景）
              tab: "data-[hover-unselected=true]:opacity-100",
              tabContent:
                "group-data-[hover-unselected=true]:text-zinc-600 dark:group-data-[hover-unselected=true]:text-zinc-300",
            }}
            selectedKey={draftMode}
            onSelectionChange={(key) => {
              const next = key === "transfer" ? "transfer" : "direct";
              gaClickEvent(
                next === "transfer"
                  ? GaEnum.TR_SEARCH_MODE_TRANSFER
                  : GaEnum.TR_SEARCH_MODE_DIRECT,
              );
              setDraftMode(next);
            }}
          >
            <Tab key="direct" title={t("searchModeDirect")} />
            <Tab key="transfer" title={t("searchModeTransfer")} />
          </Tabs>
        </div>
      )}

      <div className="mt-6 flex items-center justify-center">
        <SearchButton />
      </div>
    </>
  );
};

export default SearchArea;
