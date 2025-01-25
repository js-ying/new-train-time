import { Button } from "@nextui-org/react";
import { useTranslation } from "next-i18next";
import { FC, useContext, useState } from "react";
import {
  SearchAreaContext,
  SearchAreaParams,
  SearchAreaUpdateContext,
} from "../../contexts/SearchAreaContext";
import {
  SearchAreaActiveIndexEnum,
  SearchAreaLayerEnum,
} from "../../enums/SearchAreaParamsEnum";
import usePage from "../../hooks/usePageHook";
import useRwd from "../../hooks/useRwdHook";
import {
  ThsrStationData,
  TrStationData,
  TymcStationData,
  thsrStationDataList,
  trMainLines,
  trStationDataList,
  tymcStationDataList,
} from "../../public/data/stationsData";
import { getTdxLang } from "../../utils/LocaleUtils";

/** 車站是否在指定縣市轄區內 (僅台鐵) */
const isStationBelowMainLine = (
  trStationData: TrStationData,
  mainLine: string,
): boolean => {
  return (
    trStationData.StationAddress.replace(/[0-9]/g, "").substring(0, 3) ===
    mainLine
  );
};

/** 車站名稱是否符合輸入框內容 */
const isStationNameIncludesInput = (
  stationData: TrStationData | ThsrStationData | TymcStationData,
  inputValue: string,
): boolean => {
  const excludeStationList = ["1001"]; // 排除環島之星列車

  const enFilter = stationData.StationName.En.toLowerCase().includes(
    inputValue.toLowerCase(),
  );

  const zhHantFilter =
    stationData.StationName.Zh_tw.includes(inputValue) ||
    stationData.StationName.Zh_tw.replace("臺", "台").includes(inputValue);

  const idFilter = stationData.StationID.includes(inputValue);

  const excludeFilter = !excludeStationList.includes(stationData.StationID);

  return (enFilter || zhHantFilter || idFilter) && excludeFilter;
};

/** 處理車站選擇 */
const handleStationSelect = (
  stationId: string,
  params: SearchAreaParams,
  setParams: (params: SearchAreaParams) => void,
): void => {
  // 出發車站
  if (params?.activeIndex === SearchAreaActiveIndexEnum.START_STATION) {
    setParams({
      ...params,
      startStationId: stationId,
      activeIndex: SearchAreaActiveIndexEnum.EMPTY,
      layer: SearchAreaLayerEnum.FIRST_LAYER,
    });
  }

  // 抵達車站
  if (params?.activeIndex === 1) {
    setParams({
      ...params,
      endStationId: stationId,
      activeIndex: SearchAreaActiveIndexEnum.EMPTY,
      layer: SearchAreaLayerEnum.FIRST_LAYER,
    });
  }
};

/** [台鐵] 車站輸入框 */
const TrStationInput: FC = () => {
  const { t } = useTranslation();
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);
  const { isMobile } = useRwd();

  const placeholder =
    params.activeIndex === SearchAreaActiveIndexEnum.START_STATION
      ? t("startStationInputPlaceholder")
      : t("endStationInputPlaceholder");

  const handleInputEnter = (e) => {
    if (e.key === "Enter") {
      const filterTrStationDataList = trStationDataList.filter(
        (trStationData) => {
          return params.inputValue
            ? isStationNameIncludesInput(trStationData, params.inputValue)
            : isStationBelowMainLine(trStationData, params.inputValue);
        },
      );

      if (filterTrStationDataList.length <= 2) {
        if (filterTrStationDataList.length === 2) {
          const topLevelStation = filterTrStationDataList.find((station) =>
            ["0", "1"].includes(station.StationClass),
          );
          if (topLevelStation) {
            handleStationSelect(topLevelStation.StationID, params, setParams);
          }
        } else if (filterTrStationDataList.length === 1) {
          handleStationSelect(
            filterTrStationDataList[0].StationID,
            params,
            setParams,
          );
        }
      }
    }
  };

  return (
    <input
      type="input"
      value={params.inputValue}
      onChange={(e) => setParams({ ...params, inputValue: e.target.value })}
      className="common-input"
      placeholder={placeholder}
      onKeyDown={handleInputEnter}
      autoFocus={!isMobile ? true : false}
    ></input>
  );
};

/** [高鐵] 車站輸入框 */
const ThsrStationInput: FC = () => {
  const { t } = useTranslation();
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);
  const { isMobile } = useRwd();

  const placeholder =
    params.activeIndex === SearchAreaActiveIndexEnum.START_STATION
      ? t("startStationInputPlaceholder")
      : t("endStationInputPlaceholder");

  const handleInputEnter = (e) => {
    if (e.key === "Enter") {
      const filterStationDataList = thsrStationDataList.filter(
        (stationData) => {
          return params.inputValue
            ? isStationNameIncludesInput(stationData, params.inputValue)
            : true;
        },
      );

      if (filterStationDataList.length === 1) {
        handleStationSelect(
          filterStationDataList[0].StationID,
          params,
          setParams,
        );
      }
    }
  };

  return (
    <input
      type="input"
      value={params.inputValue}
      onChange={(e) => setParams({ ...params, inputValue: e.target.value })}
      className="common-input"
      placeholder={placeholder}
      onKeyDown={handleInputEnter}
      autoFocus={!isMobile ? true : false}
    ></input>
  );
};

/** [桃園捷運] 車站輸入框 */
const TymcStationInput: FC = () => {
  const { t } = useTranslation();
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);
  const { isMobile } = useRwd();

  const placeholder =
    params.activeIndex === SearchAreaActiveIndexEnum.START_STATION
      ? t("tymcStartStationInputPlaceholder")
      : t("tymcEndStationInputPlaceholder");

  const handleInputEnter = (e) => {
    if (e.key === "Enter") {
      const filterStationDataList = tymcStationDataList.filter(
        (stationData) => {
          return params.inputValue
            ? isStationNameIncludesInput(stationData, params.inputValue)
            : true;
        },
      );

      if (filterStationDataList.length === 1) {
        handleStationSelect(
          filterStationDataList[0].StationID,
          params,
          setParams,
        );
      }
    }
  };

  return (
    <input
      type="input"
      value={params.inputValue}
      onChange={(e) => setParams({ ...params, inputValue: e.target.value })}
      className="common-input"
      placeholder={placeholder}
      onKeyDown={handleInputEnter}
      autoFocus={!isMobile ? true : false}
    ></input>
  );
};

interface StationButtonProps {
  text: string;
  onClick: () => void;
  isTopStation?: boolean;
}

/** 車站按鈕 */
const StationButton: FC<StationButtonProps> = ({
  text,
  onClick,
  isTopStation,
}) => {
  return (
    <Button
      className={`text-md text-white 
        ${
          isTopStation
            ? "bg-gradient-to-r from-silverLakeBlue-300 via-silverLakeBlue-500 to-silverLakeBlue-300 dark:from-gamboge-400 dark:via-gamboge-600 dark:to-gamboge-400"
            : "bg-neutral-500 dark:bg-neutral-600"
        }`}
      radius="sm"
      onClick={onClick}
    >
      {text}
    </Button>
  );
};

/** [台鐵] 車站選擇 */
const SelectTrStation: FC = () => {
  const { i18n } = useTranslation();
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);
  const [mainLine, setMainLine] = useState(null);

  const handleMainLineClick = (zhMainLine: string): void => {
    setMainLine(zhMainLine);
    setParams({ ...params, layer: SearchAreaLayerEnum.SECOND_LAYER });
  };

  const getStationName = (trStationData: TrStationData): string => {
    return trStationData.StationName[getTdxLang(i18n.language)];
  };

  return (
    <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
      {/* 第 0 層：縣市 */}
      {params.layer === 0 &&
        !params.inputValue &&
        trMainLines.map((trMainLine) => (
          <StationButton
            text={trMainLine[getTdxLang(i18n.language)]}
            key={trMainLine.En}
            onClick={() => handleMainLineClick(trMainLine.Zh_tw)}
          />
        ))}
      {/* 第 1 層：車站 (若有輸入文字篩選，則顯示篩選結果；否則顯示位於指定縣市下的車站) */}
      {(params.layer === 1 || params.inputValue) &&
        trStationDataList
          .filter((trStationData) => {
            return params.inputValue
              ? isStationNameIncludesInput(trStationData, params.inputValue)
              : isStationBelowMainLine(trStationData, mainLine);
          })
          .map((trStationData) => {
            return (
              <StationButton
                text={getStationName(trStationData)}
                key={trStationData.StationName.En}
                onClick={() =>
                  handleStationSelect(
                    trStationData.StationID,
                    params,
                    setParams,
                  )
                }
                isTopStation={["0", "1"].includes(trStationData.StationClass)}
              />
            );
          })}
    </div>
  );
};

/** [高鐵] 車站選擇 */
const SelectThsrStation: FC = () => {
  const { i18n } = useTranslation();
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);

  const getStationName = (thsrStationData: ThsrStationData): string => {
    const stationName = thsrStationData.StationName[getTdxLang(i18n.language)];
    return stationName;
  };

  return (
    <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
      {/* 第 0 層：車站 (若有輸入文字篩選，則顯示篩選結果；否則顯示位於指定縣市下的車站) */}
      {(params.layer === 0 || params.inputValue) &&
        thsrStationDataList
          .filter((thSrStationData) => {
            return params.inputValue
              ? isStationNameIncludesInput(thSrStationData, params.inputValue)
              : true;
          })
          .map((thSrStationData) => {
            return (
              <StationButton
                text={getStationName(thSrStationData)}
                key={thSrStationData.StationName.En}
                onClick={() =>
                  handleStationSelect(
                    thSrStationData.StationID,
                    params,
                    setParams,
                  )
                }
              />
            );
          })}
    </div>
  );
};

/** [桃園捷運] 車站選擇 */
const SelectTymcStation: FC = () => {
  const { i18n } = useTranslation();
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);

  const getStationName = (tymcStationData: TymcStationData): string => {
    const stationName = `${tymcStationData.StationID} ${tymcStationData.StationName[getTdxLang(i18n.language)]}`;
    return stationName;
  };

  return (
    <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
      {/* 第 0 層：車站 (若有輸入文字篩選，則顯示篩選結果；否則顯示位於指定縣市下的車站) */}
      {(params.layer === 0 || params.inputValue) &&
        tymcStationDataList
          .filter((tymcStationData) => {
            return params.inputValue
              ? isStationNameIncludesInput(tymcStationData, params.inputValue)
              : true;
          })
          .map((tymcStationData) => {
            return (
              <StationButton
                text={getStationName(tymcStationData)}
                key={tymcStationData.StationName.En}
                onClick={() =>
                  handleStationSelect(
                    tymcStationData.StationID,
                    params,
                    setParams,
                  )
                }
              />
            );
          })}
    </div>
  );
};

/** 車站選擇器 */
const SelectStation: FC = () => {
  const { isTr, isThsr, isTymc } = usePage();

  return (
    <>
      {isTr && <TrStationInput />}

      {isThsr && <ThsrStationInput />}

      {isTymc && <TymcStationInput />}

      {isTr && <SelectTrStation />}

      {isThsr && <SelectThsrStation />}

      {isTymc && <SelectTymcStation />}
    </>
  );
};

export default SelectStation;
