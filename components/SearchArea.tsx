import { useRouter } from "next/router";
import { useContext } from "react";
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
      className={`flex justify-center items-center flex-col h-16 p-2 cursor-pointer
        border border-solid rounded-md border-zinc-700 dark:border-zinc-200 ${className}
        transition duration-150 ease-out
        hover:bg-zinc-700 dark:hover:bg-grayBlue hover:text-white
        ${isActive && " bg-zinc-700 dark:bg-grayBlue text-white"}`}
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
        className="w-5 h-5"
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
    px-4 py-2 cursor-pointer rounded-md
    transition duration-150 ease-out
  bg-zinc-700 dark:bg-grayBlue text-white
    hover:bg-zinc-700/80 hover:dark:bg-grayBlue/80
  "
      onClick={() => handleSearch()}
    >
      搜尋
    </button>
  );
};

const SearchArea: React.FC<SearchAreaParams> = ({ stationList }) => {
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);

  return (
    <>
      <div className="flex items-center gap-3">
        <Area
          className="flex-1"
          isActive={params.activeIndex === 0}
          onClick={() => setParams({ ...params, activeIndex: 0 })}
        >
          出發車站
          <div>{params.startStation}</div>
        </Area>
        <SwitchArrowButton />
        <Area
          className="flex-1"
          isActive={params.activeIndex === 1}
          onClick={() => setParams({ ...params, activeIndex: 1 })}
        >
          抵達車站
          <div>{params.endStation}</div>
        </Area>
        <Area
          className="flex-1 ml-4 hidden md:flex"
          isActive={params.activeIndex === 2}
          onClick={() => setParams({ ...params, activeIndex: 2 })}
        >
          出發時間
          <div>{params.datetime}</div>
        </Area>
      </div>
      <div className="mt-4 block md:hidden">
        <Area
          isActive={params.activeIndex === 2}
          onClick={() => setParams({ ...params, activeIndex: 2 })}
        >
          出發時間
          <div>{params.datetime}</div>
        </Area>
      </div>
      <div className="mt-6">
        <SelectStation />
      </div>
      <div className="flex justify-center items-center mt-7">
        <SearchButton />
      </div>
    </>
  );
};

export default SearchArea;
