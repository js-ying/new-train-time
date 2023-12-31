import { useTranslation } from "next-i18next";
import { useContext, useEffect } from "react";
import {
  SearchAreaContext,
  SearchAreaUpdateContext,
} from "../../contexts/SearchAreaContext";
import { PageEnum } from "../../enums/Page";
import {
  SearchAreaActiveIndexEnum,
  SearchAreaLayerEnum,
} from "../../enums/SearchAreaParamsEnum";
import { getStationNameById } from "../../utils/station-utils";
import SearchButton, { HistoryInquiry } from "./SearchButton";
import SelectDatetime from "./SelectDatetime";
import SelectStation from "./SelectStation";

/** 區域 */
const Area = ({ children, isActive, onClick, className = "" }) => {
  return (
    <div
      className={`flex h-16 cursor-pointer flex-col items-center justify-center rounded-md
        border border-solid border-zinc-700 p-2 dark:border-zinc-200 ${className}
        transition duration-150 ease-out
        hover:bg-zinc-700 hover:text-white dark:hover:bg-grayBlue
        ${isActive && " bg-zinc-700 text-white dark:bg-grayBlue"}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

/** 車站互換按鈕 */
const SwitchButton = ({ className = "" }) => {
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);

  return (
    <div
      className={`
          cursor-pointer ${className}
          text-zinc-700 dark:text-zinc-200
        `}
      onClick={() =>
        setParams({
          ...params,
          startStationId: params.endStationId,
          endStationId: params.startStationId,
        })
      }
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="h-5 w-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
        />
      </svg>
    </div>
  );
};

/** 搜尋區域 */
const SearchArea = ({ page }: { page: PageEnum }) => {
  const { t, i18n } = useTranslation();
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);
  const localStorageKey = `${page}HistoryList`;

  // 處理預設車站
  const handleDefaultStation = () => {
    const alreadyMountedKey = `alreadyMounted`;
    const alreadyMounted = localStorage.getItem(alreadyMountedKey);

    // 僅第一次載入時執行
    // 元件 re-mounted (切換 page 時) 也不執行
    if (!alreadyMounted || alreadyMounted === "false") {
      const valueString = window.localStorage.getItem(localStorageKey);
      if (valueString) {
        const value: HistoryInquiry[] = JSON.parse(valueString);
        if (Array.isArray(value) && value.length > 0) {
          setParams({
            ...params,
            startStationId: value[value.length - 1].startStationId,
            endStationId: value[value.length - 1].endStationId,
          });
        }
      }

      // 設定 localStorage，表示已經執行過
      localStorage.setItem(alreadyMountedKey, "true");

      // 關閉瀏覽器分頁時，刪除 localStorage 中的值，以便下次進入此系統時可預設車站
      window.addEventListener("beforeunload", () => {
        localStorage.setItem(alreadyMountedKey, "false");
      });
    }
  };

  useEffect(() => {
    handleDefaultStation();
  }, []);

  const handleStationAreaClick = (
    clickIndex: number,
    activeIndex: SearchAreaActiveIndexEnum,
  ) => {
    // 若還沒點選過任何 Area，或是點擊的與已選的 Area 不同
    if (activeIndex === null || activeIndex !== clickIndex) {
      setParams({
        ...params,
        activeIndex: clickIndex,
        layer: SearchAreaLayerEnum.FIRST_LAYER,
        inputValue: "",
      });
    } else {
      // 若此次點擊與已點選的 Area 相同，且在第一層
      if (params.layer === SearchAreaLayerEnum.FIRST_LAYER) {
        setParams({
          ...params,
          activeIndex: SearchAreaActiveIndexEnum.EMPTY,
          layer: SearchAreaLayerEnum.FIRST_LAYER,
          inputValue: "",
        });
      } else {
        setParams({
          ...params,
          layer: SearchAreaLayerEnum.FIRST_LAYER,
          inputValue: "",
        });
      }
    }
  };

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
          <div>
            {getStationNameById(page, params.startStationId, i18n.language)}
          </div>
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
          <div>
            {getStationNameById(page, params.endStationId, i18n.language)}
          </div>
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
      <div className="mt-4 block md:hidden">
        <Area
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
      <div className="mt-6">
        {params.activeIndex === SearchAreaActiveIndexEnum.START_STATION && (
          <SelectStation page={page} />
        )}
        {params.activeIndex === SearchAreaActiveIndexEnum.END_STATION && (
          <SelectStation page={page} />
        )}
        {params.activeIndex === SearchAreaActiveIndexEnum.DATE_TIME && (
          <div className="flex justify-center">
            <SelectDatetime />
          </div>
        )}
      </div>
      <div className="mt-7 flex items-center justify-center">
        <SearchButton page={page} />
      </div>
    </>
  );
};

export default SearchArea;
