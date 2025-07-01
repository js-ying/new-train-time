import { notTransportPage, PageEnum } from "@/enums/PageEnum";
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

  const handleTitleClick = () => {
    gaClickEvent(GaEnum.TITLE);
    setParams({
      ...params,
      startStationId: null,
      endStationId: null,
      date: DateUtils.getCurrentDate(),
      time: DateUtils.getCurrentTime(),
      activeIndex: SearchAreaActiveIndexEnum.EMPTY,
    });
  };

  return (
    <>
      <Link href={homePath}>
        <span
          tabIndex={0}
          role="button"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleTitleClick();
            }
          }}
          className={`custom-cursor-pointer font-bold ${isTw ? "text-lg" : "text-md"}`}
          onClick={handleTitleClick}
        >
          <span className={`${isTw ? "" : "pr-1"}`}>
            {notTransportPage.includes(page) ? t(PageEnum.TR) : t(page)}
          </span>
          {t("scheduleInquiry")}
        </span>
      </Link>
      <TrainSwitch />
    </>
  );
};

export default WebTitle;
