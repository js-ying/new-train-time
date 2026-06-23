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
import Tooltip from "@mui/material/Tooltip";
import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import Link from "next/link";
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
        <div className="relative -mb-2 mt-4 flex justify-center">
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
          {/* 站別時刻表入口 */}
          <Tooltip
            title={t("stationTimetableShort")}
            arrow
            placement="top"
            slotProps={{
              popper: {
                modifiers: [{ name: "offset", options: { offset: [0, -8] } }],
              },
            }}
          >
            <Link
              href="/station"
              aria-label={t("trStationTimetableMenu")}
              onClick={() => gaClickEvent(GaEnum.STATION_TIMETABLE_FROM_SEARCH)}
              className="absolute right-0 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-full py-1.5 pl-2 pr-0 text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5 shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
                />
              </svg>
              <span className="hidden sm:inline">
                {t("stationTimetableShort")}
              </span>
            </Link>
          </Tooltip>
        </div>
      )}

      <div className="mt-6 flex items-center justify-center">
        <SearchButton />
      </div>
    </>
  );
};

export default SearchArea;
