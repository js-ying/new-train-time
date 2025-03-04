import { notTransportPage, PageEnum } from "@/enums/PageEnum";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
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
import TrainSwitch from "../buttons/TrainSwitch";

const WebTitle: FC = () => {
  const router = useRouter();
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);
  const { t } = useTranslation();
  const { isTw } = useLang();
  const { homePath, page } = usePage();

  return (
    <>
      <span
        tabIndex={0}
        role="button"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            gaClickEvent(GaEnum.TITLE);
            setParams({
              ...params,
              startStationId: null,
              endStationId: null,
              date: DateUtils.getCurrentDate(),
              time: DateUtils.getCurrentTime(),
              activeIndex: SearchAreaActiveIndexEnum.EMPTY,
            });
            router.push({
              pathname: homePath,
            });
          }
        }}
        className={`custom-cursor-pointer font-bold ${isTw ? "text-lg" : "text-md"}`}
        onClick={() => {
          gaClickEvent(GaEnum.TITLE);
          setParams({
            ...params,
            startStationId: null,
            endStationId: null,
            date: DateUtils.getCurrentDate(),
            time: DateUtils.getCurrentTime(),
            activeIndex: SearchAreaActiveIndexEnum.EMPTY,
          });
          router.push({
            pathname: homePath,
          });
        }}
      >
        <span className={`${isTw ? "" : "pr-1"}`}>
          {notTransportPage.includes(page) ? t(PageEnum.TR) : t(page)}
        </span>
        {t("scheduleInquiry")}
      </span>
      <TrainSwitch />
    </>
  );
};

export default WebTitle;
