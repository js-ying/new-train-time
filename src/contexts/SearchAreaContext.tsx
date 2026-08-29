import { PageEnum } from "@/enums/PageEnum";
import {
  SearchAreaActiveIndexEnum,
  SearchAreaLayerEnum,
} from "@/enums/SearchAreaParamsEnum";
import usePage from "@/hooks/usePage";
import DateUtils from "@/utils/DateUtils";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
export interface SearchAreaParams {
  startStationId: string;
  endStationId: string;
  date: string;
  time: string;
  activeIndex: SearchAreaActiveIndexEnum;
  // 目前只有台鐵的 SelectStation 才有分兩層，其餘皆為一層 (layer = 0)
  layer: SearchAreaLayerEnum;
  inputValue: string;
  uuid: string;
}

/** 起訖站以外的欄位：日期時間與選單暫態，跨鐵路共用 */
type SharedParams = Omit<SearchAreaParams, "startStationId" | "endStationId">;

/** 起訖站依鐵路各存一份：TR 與 THSR 站號空間重疊（1020 分別是板橋與桃園） */
type StationPair = Pick<SearchAreaParams, "startStationId" | "endStationId">;

interface SearchAreaState {
  shared: SharedParams;
  stationsByPage: Partial<Record<PageEnum, StationPair>>;
}

type SearchAreaUpdater =
  | Partial<SearchAreaParams>
  | ((prev: SearchAreaParams) => Partial<SearchAreaParams>);

const EMPTY_STATION_PAIR: StationPair = {
  startStationId: null,
  endStationId: null,
};

/** 把一次更新拆回「共用欄位」與「當前鐵路的起訖站」兩區 */
export const applySearchAreaUpdate = (
  prev: SearchAreaState,
  updater: SearchAreaUpdater,
  page: PageEnum,
): SearchAreaState => {
  const currentStations = prev.stationsByPage[page] ?? EMPTY_STATION_PAIR;
  const next =
    typeof updater === "function"
      ? updater({ ...prev.shared, ...currentStations })
      : updater;
  const { startStationId, endStationId, ...shared } = next;

  return {
    shared: { ...prev.shared, ...shared },
    stationsByPage: {
      ...prev.stationsByPage,
      [page]: {
        startStationId:
          "startStationId" in next
            ? startStationId
            : currentStations.startStationId,
        endStationId:
          "endStationId" in next ? endStationId : currentStations.endStationId,
      },
    },
  };
};

export const SearchAreaContext = createContext<SearchAreaParams>(null);
export const SearchAreaUpdateContext = createContext(null);

export function SearchAreaProvider({ children }) {
  const { page } = usePage();
  // updater 在 setState 內執行，用 ref 讀當下路由
  const pageRef = useRef(page);
  pageRef.current = page;

  const [state, setState] = useState<SearchAreaState>({
    shared: {
      date: null,
      time: null,
      activeIndex: SearchAreaActiveIndexEnum.EMPTY,
      layer: SearchAreaLayerEnum.FIRST_LAYER,
      inputValue: "",
      uuid: "",
    },
    stationsByPage: {},
  });

  // 對外仍是單一 SearchAreaParams，起訖站取當前鐵路那一份
  const searchAreaParams = useMemo<SearchAreaParams>(
    () => ({
      ...state.shared,
      ...(state.stationsByPage[page] ?? EMPTY_STATION_PAIR),
    }),
    [state, page],
  );

  const setSearchAreaParams = useCallback((updater: SearchAreaUpdater) => {
    setState((prev) => applySearchAreaUpdate(prev, updater, pageRef.current));
  }, []);

  useEffect(() => {
    setSearchAreaParams((prev) => ({
      ...prev,
      date: prev.date || DateUtils.getCurrentDate(),
      time: prev.time || DateUtils.getCurrentTime(),
    }));
  }, [setSearchAreaParams]);

  return (
    <SearchAreaContext.Provider value={searchAreaParams}>
      <SearchAreaUpdateContext.Provider value={setSearchAreaParams}>
        {children}
      </SearchAreaUpdateContext.Provider>
    </SearchAreaContext.Provider>
  );
}
