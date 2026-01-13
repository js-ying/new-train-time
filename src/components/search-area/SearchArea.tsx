import { SearchAreaActiveIndexEnum } from "@/enums/SearchAreaParamsEnum";
import { useSearchAreaNavigation } from "@/hooks/station/useSearchAreaNavigation";
import useDefaultStationHandling from "@/hooks/useDefaultStationHandling";
import usePage from "@/hooks/usePage";
import useRwd from "@/hooks/useRwd";
import { getStationNameById } from "@/utils/StationUtils";
import { useTranslation } from "next-i18next";
import { FC } from "react";
import Area from "./Area";
import SearchButton from "./SearchButton";
import SelectDatetime from "./SelectDatetime";
import SelectStation from "./SelectStation";
import SwitchButton from "./SwitchButton";

/** 搜尋區域 */
const SearchArea: FC = () => {
  const { t, i18n } = useTranslation();
  const { page, isTymc } = usePage();
  const { isMobile } = useRwd();
  const { params, handleStationAreaClick } = useSearchAreaNavigation();
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
      <div className="mt-6">
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
      <div className="mt-7 flex items-center justify-center">
        <SearchButton />
      </div>
    </>
  );
};

export default SearchArea;
