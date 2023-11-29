import { useContext } from "react";
import ThemeSwitch from "./ThemeSwitch";
import {
  SearchAreaContext,
  SearchAreaUpdateContext,
} from "../contexts/SearchAreaContext";
import LocaleChange from "./LocaleChange";

interface LayoutParams {
  children: React.ReactNode;
  title?: string;
}

export default function Layout({ children, title = "" }: LayoutParams) {
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="relative mb-6">
        <h1 className="text-center">
          <span
            className="cursor-pointer"
            onClick={() =>
              setParams({
                ...params,
                startStation: null,
                endStation: null,
                datetime: null,
                activeIndex: null,
              })
            }
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
