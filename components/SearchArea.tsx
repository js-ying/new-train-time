import { MouseEventHandler, useState } from "react";

const SwitchArrowButton = ({ className = "" }) => {
  return (
    <div
      className={`transition duration-150 ease-out text-zinc-700 cursor-pointer ${className}
      hover:text-zinc-400 hover:ease-in`}
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

interface AreaParams {
  children: React.ReactNode;
  isActive: boolean;
  onClick: MouseEventHandler<HTMLDivElement>;
  className?: string;
}

const Area = ({ children, isActive, onClick, className = "" }: AreaParams) => {
  return (
    <div
      className={`flex justify-center items-center flex-col h-16 p-2
        border border-solid border-black rounded-md cursor-pointer ${className}
        transition duration-150 ease-out
        hover:bg-zinc-700 hover:text-white hover:ease-in
        ${isActive ? " bg-zinc-700 text-white" : ""}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface SearchAreaParams {
  startStation: string;
  endStation: string;
  datetime: string;
  stationList: string[];
}

const SearchArea = ({
  startStation,
  endStation,
  datetime,
}: SearchAreaParams) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const clickArea = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <Area
          className="flex-1"
          isActive={activeIndex === 0}
          onClick={() => clickArea(0)}
        >
          出發車站
          <div>{startStation}</div>
        </Area>
        <SwitchArrowButton />
        <Area
          className="flex-1"
          isActive={activeIndex === 1}
          onClick={() => clickArea(1)}
        >
          抵達車站
          <div>{endStation}</div>
        </Area>
        <Area
          className="flex-1 ml-4 hidden md:flex"
          isActive={activeIndex === 2}
          onClick={() => clickArea(2)}
        >
          出發時間
          <div>{datetime}</div>
        </Area>
      </div>
      <div className="mt-4 block md:hidden">
        <Area isActive={activeIndex === 2} onClick={() => clickArea(2)}>
          出發時間
          <div>{datetime}</div>
        </Area>
      </div>
    </>
  );
};

export default SearchArea;
