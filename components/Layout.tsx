import { useRouter } from "next/router";
import { useContext } from "react";
import {
  SearchAreaContext,
  SearchAreaUpdateContext,
} from "../contexts/SearchAreaContext";
import { PageEnum } from "../enums/Page";
import { PathEnum } from "../enums/Path";
import { SearchAreaActiveIndexEnum } from "../enums/SearchAreaParamsEnum";
import DateUtils from "../utils/date-utils";
import LocaleChange from "./LocaleChange";
import ThemeSwitch from "./ThemeSwitch";
import TrainSwitch from "./TrainSwitch";

interface LayoutParams {
  children: React.ReactNode;
  page: PageEnum;
  title?: string;
}

export default function Layout({ children, page, title = "" }: LayoutParams) {
  const router = useRouter();
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="relative mb-6">
        <div className="absolute left-0 top-0.5">
          <TrainSwitch page={page} />
        </div>
        <h1 className="text-center">
          <span
            className="cursor-pointer"
            onClick={() => {
              setParams({
                ...params,
                startStationId: null,
                endStationId: null,
                date: DateUtils.getCurrentDate(),
                time: DateUtils.getCurrentTime(),
                activeIndex: SearchAreaActiveIndexEnum.EMPTY,
              });
              router.push({
                pathname: PathEnum[page + "Home"],
              });
            }}
          >
            {title}
          </span>
        </h1>
        <div className="absolute right-0 top-0.5">
          <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-200">
            <LocaleChange page={page} />
            <ThemeSwitch />
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
