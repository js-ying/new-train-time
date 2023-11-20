import {
  AreaParams,
  SearchAreaParams,
  SwitchArrowButtonParams,
} from "./interfaces/SearchArea";

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

const Area: React.FC<AreaParams> = ({
  children,
  isActive,
  onClick,
  className = "",
}) => {
  return (
    <div
      className={`flex justify-center items-center flex-col h-16 p-2
        rounded-md cursor-pointer
        border border-solid border-black dark:border-white ${className}
        transition duration-150 ease-out
        hover:bg-zinc-700 dark:hover:bg-grayBlue hover:text-white hover:ease-in
        ${isActive && " bg-zinc-700 dark:bg-grayBlue text-white"}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

const SearchArea: React.FC<SearchAreaParams> = ({
  startStation,
  endStation,
  datetime,
  activeIndex,
  setActiveIndex,
}) => {
  return (
    <>
      <div className="flex items-center gap-4">
        <Area
          className="flex-1"
          isActive={activeIndex === 0}
          onClick={() => setActiveIndex(0)}
        >
          出發車站
          <div>{startStation}</div>
        </Area>
        <SwitchArrowButton />
        <Area
          className="flex-1"
          isActive={activeIndex === 1}
          onClick={() => setActiveIndex(1)}
        >
          抵達車站
          <div>{endStation}</div>
        </Area>
        <Area
          className="flex-1 ml-4 hidden md:flex"
          isActive={activeIndex === 2}
          onClick={() => setActiveIndex(2)}
        >
          出發時間
          <div>{datetime}</div>
        </Area>
      </div>
      <div className="mt-4 block md:hidden">
        <Area isActive={activeIndex === 2} onClick={() => setActiveIndex(2)}>
          出發時間
          <div>{datetime}</div>
        </Area>
      </div>
    </>
  );
};

export default SearchArea;
