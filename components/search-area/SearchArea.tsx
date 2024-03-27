import { Button } from "@nextui-org/react";
import { useTranslation } from "next-i18next";
import { FC, ReactNode, useContext } from "react";
import {
  SearchAreaContext,
  SearchAreaUpdateContext,
} from "../../contexts/SearchAreaContext";
import {
  SearchAreaActiveIndexEnum,
  SearchAreaLayerEnum,
} from "../../enums/SearchAreaParamsEnum";
import useDefaultStationHandling from "../../hooks/useDefaultStationHandlingHook";
import usePage from "../../hooks/usePageHook";
import { getStationNameById } from "../../utils/StationUtils";
import SearchButton from "./SearchButton";
import SelectDatetime from "./SelectDatetime";
import SelectStation from "./SelectStation";

interface AreaProps {
  children: ReactNode;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

/** 區域 */
const Area: FC<AreaProps> = ({
  children,
  isActive,
  onClick,
  className = "",
}) => {
  return (
    <div
      className={`flex h-16 cursor-pointer flex-col items-center justify-center rounded-md
        border border-solid border-zinc-700 p-2 dark:border-zinc-200 ${className}
        transition duration-150 ease-out
        hover:bg-zinc-700 hover:text-white dark:hover:bg-silverLakeBlue-500
        ${isActive && " bg-zinc-700 text-white dark:bg-silverLakeBlue-500"}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface SwitchButtonProps {
  className?: string;
}

/** 車站互換按鈕 */
const SwitchButton: FC<SwitchButtonProps> = ({ className = "" }) => {
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);

  return (
    <Button
      size="sm"
      variant="light"
      className="min-w-fit px-0 text-zinc-700 dark:text-zinc-200 sm:px-1.5"
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
    </Button>
  );
};

/** 搜尋區域 */
const SearchArea: FC = () => {
  const { t, i18n } = useTranslation();
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);
  const { page } = usePage();

  // 處理預設車站
  useDefaultStationHandling();

  // 處理車站區域點擊
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
          <SelectStation />
        )}
        {params.activeIndex === SearchAreaActiveIndexEnum.END_STATION && (
          <SelectStation />
        )}
        {params.activeIndex === SearchAreaActiveIndexEnum.DATE_TIME && (
          <div className="flex justify-center">
            <SelectDatetime />
          </div>
        )}
      </div>
      <div className="mt-7 flex items-center justify-center">
        <SearchButton />
      </div>
    </>
  );
};

export default SearchArea;
