import { useContext } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import SelectStation from "./SelectStation";
import {
  SearchAreaContext,
  SearchAreaUpdateContext,
} from "../contexts/SearchAreaContext";
import { getTrStationNameById } from "../utils/station-utils";

const Area = ({ children, isActive, onClick, className = "" }) => {
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

const SwitchButton = ({ className = "" }) => {
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);

  return (
    <div
      className={`
          cursor-pointer ${className}
          text-zinc-700 dark:text-zinc-200
        `}
      onClick={() =>
        setParams({
          ...params,
          startStation: params.endStation,
          endStation: params.startStation,
        })
      }
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

const SearchButton = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const params = useContext(SearchAreaContext);

  const handleSearch = () => {
    router.push({
      pathname: "/TR/search",
      query: {
        s: getTrStationNameById(params.startStation, i18n.language),
        e: getTrStationNameById(params.endStation, i18n.language),
        d: params.datetime,
        t: "1300",
      },
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

const SearchArea = () => {
  const { t, i18n } = useTranslation();
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);

  const handleStationAreaClick = (clickIndex: number, activeIndex: number) => {
    // 若還沒點選過任何 Area，或是點擊的與已選的 Area 不同
    if (activeIndex === null || activeIndex !== clickIndex) {
      setParams({
        ...params,
        activeIndex: clickIndex,
        layer: 0,
        inputValue: "",
      });
    } else {
      // 若此次點擊與已點選的 Area 相同，且在第一層
      if (params.layer === 0) {
        setParams({
          ...params,
          activeIndex: null,
          layer: 0,
          inputValue: "",
        });
      } else {
        setParams({
          ...params,
          layer: 0,
          inputValue: "",
        });
      }
    }
  };

  return (
    <>
      <div className="flex items-center gap-3">
        <Area
          className="flex-1"
          isActive={params.activeIndex === 0}
          onClick={() => handleStationAreaClick(0, params.activeIndex)}
        >
          {t("startStation")}
          <div>{getTrStationNameById(params.startStation, i18n.language)}</div>
        </Area>
        <SwitchButton />
        <Area
          className="flex-1"
          isActive={params.activeIndex === 1}
          onClick={() => handleStationAreaClick(1, params.activeIndex)}
        >
          {t("endStation")}
          <div>{getTrStationNameById(params.endStation, i18n.language)}</div>
        </Area>
        <Area
          className="ml-4 hidden flex-1 md:flex"
          isActive={params.activeIndex === 2}
          onClick={() => handleStationAreaClick(2, params.activeIndex)}
        >
          {t("datetime")}
          <div>{params.datetime}</div>
        </Area>
      </div>
      <div className="mt-4 block md:hidden">
        <Area
          isActive={params.activeIndex === 2}
          onClick={() => handleStationAreaClick(2, params.activeIndex)}
        >
          {t("datetime")}
          <div>{params.datetime}</div>
        </Area>
      </div>
      <div className="mt-6">
        {params.activeIndex === 0 && <SelectStation />}
        {params.activeIndex === 1 && <SelectStation />}
      </div>
      <div className="mt-7 flex items-center justify-center">
        <SearchButton />
      </div>
    </>
  );
};

export default SearchArea;
