import { useTranslation } from "next-i18next";
import { useContext, useState } from "react";
import {
  SearchAreaContext,
  SearchAreaParams,
  SearchAreaUpdateContext,
} from "../../contexts/SearchAreaContext";
import { PageEnum } from "../../enums/Page";
import {
  SearchAreaActiveIndexEnum,
  SearchAreaLayerEnum,
} from "../../enums/SearchAreaParamsEnum";
import {
  TrStationData,
  trMainLines,
  trStationDataList,
} from "../../public/data/stationsData";
import { getTdxLang } from "../../utils/locale-utils";

/** 車站是否在指定縣市轄區內 */
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
  trStationData: TrStationData,
  inputValue: string,
): boolean => {
  const excludeStationList = ["1001"]; // 排除環島之星列車

  const enFilter = trStationData.StationName.En.toLowerCase().includes(
    inputValue.toLowerCase(),
  );
  const zhHantFilter =
    trStationData.StationName.Zh_tw.includes(inputValue) ||
    trStationData.StationName.Zh_tw.replace("臺", "台").includes(inputValue);
  const excludeFilter = !excludeStationList.includes(trStationData.StationID);

  return (enFilter || zhHantFilter) && excludeFilter;
};

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

/** 車站輸入框 */
const StationInput = () => {
  const { t } = useTranslation();
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);

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
      autoFocus
    ></input>
  );
};

/** 車站按鈕 */
const StationButton = ({ text, onClick }) => {
  return (
    <div className="common-button px-3 py-2" onClick={onClick}>
      {text}
    </div>
  );
};

/** 車站選擇-台鐵 */
const SelectTrStation = () => {
  const { i18n } = useTranslation();
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);
  const [mainLine, setMainLine] = useState(null);

  const handleMainLineClick = (zhMainLine: string): void => {
    setMainLine(zhMainLine);
    setParams({ ...params, layer: SearchAreaLayerEnum.SECOND_LAYER });
  };

  const getStationName = (trStationData: TrStationData): string => {
    const stationName = trStationData.StationName[getTdxLang(i18n.language)];

    // top level station
    if (["0", "1"].includes(trStationData.StationClass)) {
      return `※ ${stationName} ※`;
    }

    return stationName;
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
              />
            );
          })}
    </div>
  );
};

/** 車站選擇-高鐵 */
const SelectThsrStation = () => {
  return <div></div>;
};

/** 車站選擇器 */
const SelectStation = ({ page }: { page: PageEnum }) => {
  const isTr = page === PageEnum.TR;
  const isThsr = page === PageEnum.THSR;

  return (
    <>
      <StationInput />

      {isTr && <SelectTrStation />}

      {isThsr && <SelectThsrStation />}
    </>
  );
};

export default SelectStation;
