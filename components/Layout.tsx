import { useContext } from "react";
import { useRouter } from "next/router";
import ThemeSwitch from "./ThemeSwitch";
import LocaleChange from "./LocaleChange";
import {
  SearchAreaContext,
  SearchAreaUpdateContext,
} from "../contexts/SearchAreaContext";
import DateUtils from "../utils/date-utils";
import { PathEnum } from "../enums/Path";
import { SearchAreaActiveIndexEnum } from "../enums/SearchAreaParamsEnum";

interface LayoutParams {
  children: React.ReactNode;
  page: string;
  title?: string;
}

export default function Layout({ children, page, title = "" }: LayoutParams) {
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);
  const router = useRouter();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="relative mb-6">
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
            <LocaleChange />
            <ThemeSwitch />
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
