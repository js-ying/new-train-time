import { notTransportPage, PageEnum } from "@/enums/PageEnum";
import { recordLastUsedPage } from "@/utils/PageUtils";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { FC, useContext } from "react";
import {
  SearchAreaContext,
  SearchAreaUpdateContext,
} from "../../contexts/SearchAreaContext";
import { GaEnum } from "../../enums/GaEnum";
import { SearchAreaActiveIndexEnum } from "../../enums/SearchAreaParamsEnum";
import useLang from "../../hooks/useLangHook";
import usePage from "../../hooks/usePageHook";
import DateUtils from "../../utils/DateUtils";
import { gaClickEvent } from "../../utils/GaUtils";
import TrainSwitch from "./TrainSwitch";

const WebTitle: FC = () => {
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);
  const { t } = useTranslation();
  const { isTw } = useLang();
  const { homePath, page } = usePage();

  const resetParams = (targetPage: PageEnum) => {
    setParams({
      ...params,
      startStationId: null,
      endStationId: null,
      date: DateUtils.getCurrentDate(),
      time: DateUtils.getCurrentTime(),
      activeIndex: SearchAreaActiveIndexEnum.EMPTY,
    });

    // Record usage
    recordLastUsedPage(targetPage);

    // GA Tracking based on target page
    if (targetPage === PageEnum.TR) gaClickEvent(GaEnum.TR_TITLE);
    else if (targetPage === PageEnum.THSR) gaClickEvent(GaEnum.THSR_TITLE);
    else if (targetPage === PageEnum.TYMC) gaClickEvent(GaEnum.TYMC_TITLE);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Main Title */}
      <Link
        href={homePath}
        onClick={() => resetParams(page)}
        className="custom-cursor-pointer mb-2"
      >
        <span className={`font-bold ${isTw ? "text-xl" : "text-lg"}`}>
          <span className={`${isTw ? "" : "pr-1"}`}>
            {notTransportPage.includes(page) ? t(PageEnum.TR) : t(page)}
          </span>
          {t("scheduleInquiry")}
        </span>
      </Link>

      {/* Transport Tabs */}
      <TrainSwitch />
    </div>
  );
};

export default WebTitle;

