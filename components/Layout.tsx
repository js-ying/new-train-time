import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { FC, useContext } from "react";
import {
  SearchAreaContext,
  SearchAreaUpdateContext,
} from "../contexts/SearchAreaContext";
import { GaEnum } from "../enums/GaEnum";
import { SearchAreaActiveIndexEnum } from "../enums/SearchAreaParamsEnum";
import useLang from "../hooks/useLangHook";
import usePage from "../hooks/usePageHook";
import DateUtils from "../utils/DateUtils";
import { gaClickEvent } from "../utils/GaUtils";
import LocaleChange from "./LocaleChange";
import Sidebar from "./Sidebar";
import ThemeSwitch from "./ThemeSwitch";
import TrainSwitch from "./TrainSwitch";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: FC<LayoutProps> = ({ children, title = "" }) => {
  const router = useRouter();
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);
  const { t } = useTranslation();
  const { isTw } = useLang();
  const { homePath } = usePage();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="relative mb-6">
        <div className="absolute left-0 top-0.5">
          <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-200">
            <Sidebar />
          </div>
        </div>
        <h2 className="flex items-center justify-center gap-1">
          <TrainSwitch />
          <span
            className={`cursor-pointer ${
              isTw ? "text-lg" : "text-sm sm:text-lg "
            }`}
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
            {t("scheduleInquiry")}
          </span>
        </h2>
        <div className="absolute right-0 top-0.5">
          <div className="fade-in flex items-center gap-2 text-zinc-700 dark:text-zinc-200">
            <LocaleChange />
            <ThemeSwitch />
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};

export default Layout;
