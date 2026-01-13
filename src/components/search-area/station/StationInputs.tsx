import { SearchAreaActiveIndexEnum } from "@/enums/SearchAreaParamsEnum";
import { useStationSearch } from "@/hooks/station/useStationSearch";
import useRwd from "@/hooks/useRwd";
import { useTranslation } from "next-i18next";
import {
  thsrStationDataList,
  trStationDataList,
  tymcStationDataList,
} from "public/data/stationsData";
import { FC, useEffect, useRef } from "react";

interface StationInputProps {
  type: "TR" | "THSR" | "TYMC";
}

const StationInput: FC<StationInputProps> = ({ type }) => {
  const { t } = useTranslation();
  const { isMobile } = useRwd();
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    params,
    setParams,
    isStationNameIncludesInput,
    isStationBelowMainLine,
    handleStationSelect,
  } = useStationSearch();

  const isTymc = type === "TYMC";
  const placeholder =
    params.activeIndex === SearchAreaActiveIndexEnum.START_STATION
      ? t(
          isTymc
            ? "tymcStartStationInputPlaceholder"
            : "startStationInputPlaceholder",
        )
      : t(
          isTymc
            ? "tymcEndStationInputPlaceholder"
            : "endStationInputPlaceholder",
        );

  const handleInputEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      let filteredList: any[] = [];
      if (type === "TR") {
        filteredList = trStationDataList.filter((station) =>
          params.inputValue
            ? isStationNameIncludesInput(station, params.inputValue)
            : isStationBelowMainLine(station, params.inputValue),
        );
      } else if (type === "THSR") {
        filteredList = thsrStationDataList.filter((station) =>
          params.inputValue
            ? isStationNameIncludesInput(station, params.inputValue)
            : true,
        );
      } else {
        filteredList = tymcStationDataList.filter((station) =>
          params.inputValue
            ? isStationNameIncludesInput(station, params.inputValue)
            : true,
        );
      }

      if (type === "TR" && filteredList.length === 2) {
        const topLevelStation = filteredList.find((station) =>
          ["0", "1"].includes(station.StationClass),
        );
        if (topLevelStation) {
          handleStationSelect(topLevelStation.StationID);
          return;
        }
      }

      if (filteredList.length === 1) {
        handleStationSelect(filteredList[0].StationID);
      }
    }
  };

  useEffect(() => {
    if (!isMobile && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isMobile]);

  return (
    <input
      type="input"
      value={params.inputValue}
      onChange={(e) => setParams({ ...params, inputValue: e.target.value })}
      className="common-input"
      placeholder={placeholder}
      onKeyDown={handleInputEnter}
      ref={inputRef}
    />
  );
};

export const TrStationInput = () => <StationInput type="TR" />;
export const ThsrStationInput = () => <StationInput type="THSR" />;
export const TymcStationInput = () => <StationInput type="TYMC" />;
