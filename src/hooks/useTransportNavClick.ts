import {
  SearchAreaContext,
  SearchAreaUpdateContext,
} from "@/contexts/SearchAreaContext";
import { GaEnum } from "@/enums/GaEnum";
import { PageEnum } from "@/enums/PageEnum";
import { SearchAreaActiveIndexEnum } from "@/enums/SearchAreaParamsEnum";
import usePage from "@/hooks/usePage";
import DateUtils from "@/utils/DateUtils";
import { gaClickEvent } from "@/utils/GaUtils";
import { getHomePath, recordLastUsedPath } from "@/utils/PageUtils";
import { useContext } from "react";

/** 各運具的標題點擊事件；非交通工具頁不發 GA */
const TITLE_GA_EVENT: Partial<Record<PageEnum, GaEnum>> = {
  [PageEnum.TR]: GaEnum.TR_TITLE,
  [PageEnum.THSR]: GaEnum.THSR_TITLE,
  [PageEnum.TYMC]: GaEnum.TYMC_TITLE,
  [PageEnum.BUS]: GaEnum.BUS_TITLE,
};

/**
 * 點運具標題或鐵路分頁導航時的共同副作用，兩個入口共用同一套重設規則：
 * 在入口頁點當前所在的運具即重設查詢條件，其餘情況只做導航。
 */
const useTransportNavClick = () => {
  const { page, isHome } = usePage();
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);

  return (targetPage: PageEnum) => {
    const isReset = isHome && targetPage === page;

    setParams({
      ...params,
      activeIndex: SearchAreaActiveIndexEnum.EMPTY,
      ...(isReset
        ? {
            startStationId: null,
            endStationId: null,
            date: DateUtils.getCurrentDate(),
            time: DateUtils.getCurrentTime(),
          }
        : {}),
    });

    recordLastUsedPath(getHomePath(targetPage));

    const gaEvent = TITLE_GA_EVENT[targetPage];
    if (gaEvent) gaClickEvent(gaEvent);
  };
};

export default useTransportNavClick;
