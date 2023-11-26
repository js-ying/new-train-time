import { useContext } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import SelectStation from "./SelectStation";
import {
  SearchAreaContext,
  SearchAreaUpdateContext,
} from "../contexts/SearchAreaContext";

interface AreaParams {
  children: React.ReactNode;
  isActive: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  className?: string;
}

interface SwitchArrowButtonParams {
  className?: string;
}

interface SearchAreaParams {
  stationList: string[];
}

const Area: React.FC<AreaParams> = ({
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
        hover:bg-zinc-700 hover:text-white dark:hover:bg-grayBlue
        ${isActive && " bg-zinc-700 text-white dark:bg-grayBlue"}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

const SwitchArrowButton: React.FC<SwitchArrowButtonParams> = ({
  className = "",
}) => {
  return (
    <div
      className={`
          cursor-pointer ${className}
          text-zinc-700 dark:text-zinc-200
        `}
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
    </div>
  );
};

const SearchButton: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const handleSearch = () => {
    router.push({
      pathname: "/TR/search",
      query: { s: "台北", e: "新竹", d: "2023-11-21", t: "1300" },
    });
  };

  return (
    <button
      type="button"
      className="
        cursor-pointer rounded-md bg-zinc-700 px-4
        py-2 text-white transition
      duration-150 ease-out hover:bg-zinc-700/80
        dark:bg-grayBlue hover:dark:bg-grayBlue/80
  "
      onClick={() => handleSearch()}
    >
      {t("searchBtn")}
    </button>
  );
};

const SearchArea: React.FC<SearchAreaParams> = ({ stationList }) => {
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);
  const { t } = useTranslation();
  return (
    <>
      <div className="flex items-center gap-3">
        <Area
          className="flex-1"
          isActive={params.activeIndex === 0}
          onClick={() => setParams({ ...params, activeIndex: 0 })}
        >
          {t("startStation")}
          <div>{params.startStation}</div>
        </Area>
        <SwitchArrowButton />
        <Area
          className="flex-1"
          isActive={params.activeIndex === 1}
          onClick={() => setParams({ ...params, activeIndex: 1 })}
        >
          {t("endStation")}
          <div>{params.endStation}</div>
        </Area>
        <Area
          className="ml-4 hidden flex-1 md:flex"
          isActive={params.activeIndex === 2}
          onClick={() => setParams({ ...params, activeIndex: 2 })}
        >
          {t("datetime")}
          <div>{params.datetime}</div>
        </Area>
      </div>
      <div className="mt-4 block md:hidden">
        <Area
          isActive={params.activeIndex === 2}
          onClick={() => setParams({ ...params, activeIndex: 2 })}
        >
          {t("datetime")}
          <div>{params.datetime}</div>
        </Area>
      </div>
      <div className="mt-6">
        <SelectStation />
      </div>
      <div className="mt-7 flex items-center justify-center">
        <SearchButton />
      </div>
    </>
  );
};

export default SearchArea;
