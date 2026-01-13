import { SearchAreaLayerEnum } from "@/enums/SearchAreaParamsEnum";
import { useStationSearch } from "@/hooks/station/useStationSearch";
import { getTdxLang } from "@/utils/LocaleUtils";
import { useTranslation } from "next-i18next";
import {
  thsrStationDataList,
  trMainLines,
  trStationDataList,
  tymcStationDataList,
} from "public/data/stationsData";
import { FC, useState } from "react";
import StationButton from "./StationButton";

/** [台鐵] 車站選擇 */
export const SelectTrStation: FC = () => {
  const { i18n } = useTranslation();
  const [mainLine, setMainLine] = useState<string | null>(null);
  const {
    params,
    setParams,
    isStationBelowMainLine,
    isStationNameIncludesInput,
    handleStationSelect,
  } = useStationSearch();

  const handleMainLineClick = (zhMainLine: string): void => {
    setMainLine(zhMainLine);
    setParams({ ...params, layer: SearchAreaLayerEnum.SECOND_LAYER });
  };

  return (
    <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
      {params.layer === SearchAreaLayerEnum.FIRST_LAYER &&
        !params.inputValue &&
        trMainLines.map((trMainLine) => (
          <StationButton
            text={trMainLine[getTdxLang(i18n.language)]}
            key={trMainLine.En}
            onClick={() => handleMainLineClick(trMainLine.Zh_tw)}
          />
        ))}
      {(params.layer === SearchAreaLayerEnum.SECOND_LAYER ||
        params.inputValue) &&
        trStationDataList
          .filter((trStationData) => {
            return params.inputValue
              ? isStationNameIncludesInput(trStationData, params.inputValue)
              : isStationBelowMainLine(trStationData, mainLine);
          })
          .map((trStationData) => (
            <StationButton
              text={trStationData.StationName[getTdxLang(i18n.language)]}
              key={trStationData.StationName.En}
              onClick={() => handleStationSelect(trStationData.StationID)}
              isTopStation={["0", "1"].includes(trStationData.StationClass)}
            />
          ))}
    </div>
  );
};

/** [高鐵] 車站選擇 */
export const SelectThsrStation: FC = () => {
  const { i18n } = useTranslation();
  const { params, isStationNameIncludesInput, handleStationSelect } =
    useStationSearch();

  return (
    <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
      {(params.layer === SearchAreaLayerEnum.FIRST_LAYER ||
        params.inputValue) &&
        thsrStationDataList
          .filter((thSrStationData) => {
            return params.inputValue
              ? isStationNameIncludesInput(thSrStationData, params.inputValue)
              : true;
          })
          .map((thSrStationData) => (
            <StationButton
              text={thSrStationData.StationName[getTdxLang(i18n.language)]}
              key={thSrStationData.StationName.En}
              onClick={() => handleStationSelect(thSrStationData.StationID)}
            />
          ))}
    </div>
  );
};

/** [桃園捷運] 車站選擇 */
export const SelectTymcStation: FC = () => {
  const { i18n } = useTranslation();
  const { params, isStationNameIncludesInput, handleStationSelect } =
    useStationSearch();

  return (
    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
      {(params.layer === SearchAreaLayerEnum.FIRST_LAYER ||
        params.inputValue) &&
        tymcStationDataList
          .filter((tymcStationData) => {
            return params.inputValue
              ? isStationNameIncludesInput(tymcStationData, params.inputValue)
              : true;
          })
          .map((tymcStationData) => (
            <StationButton
              text={`${tymcStationData.StationID} ${tymcStationData.StationName[getTdxLang(i18n.language)]}`}
              key={tymcStationData.StationName.En}
              onClick={() => handleStationSelect(tymcStationData.StationID)}
            />
          ))}
    </div>
  );
};
