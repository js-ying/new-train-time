import { SearchAreaLayerEnum } from "@/enums/SearchAreaParamsEnum";
import { useStationSearch } from "@/hooks/station/useStationSearch";
import { getTdxLang } from "@/utils/LocaleUtils";
import { useTranslation } from "next-i18next";
import {
  thsrStationDataList,
  trMainLines,
  trStationDataList,
  tymcStationDataList,
} from "@/data/stationsData";
import { FC, useCallback, useDeferredValue, useMemo, useState } from "react";
import StationButton from "./StationButton";

/** [台鐵] 車站選擇 */
export const SelectTrStation: FC = () => {
  const { i18n } = useTranslation();
  const lang = getTdxLang(i18n.language);
  const [mainLine, setMainLine] = useState<string | null>(null);
  const {
    params,
    setParams,
    isStationBelowMainLine,
    isStationNameIncludesInput,
    handleStationSelect,
  } = useStationSearch();

  // 以 deferred 輸入值驅動清單：打字時輸入框（另一元件）即時更新，
  // 數百筆過濾與按鈕 reconcile 改在低優先級 render 進行，互動不被卡住。
  const deferredInput = useDeferredValue(params.inputValue);

  const handleMainLineClick = useCallback(
    (zhMainLine: string): void => {
      setMainLine(zhMainLine);
      setParams((prev) => ({
        ...prev,
        layer: SearchAreaLayerEnum.SECOND_LAYER,
      }));
    },
    [setParams],
  );

  const filteredStations = useMemo(() => {
    if (deferredInput) {
      return trStationDataList.filter((trStationData) =>
        isStationNameIncludesInput(trStationData, deferredInput),
      );
    }
    if (params.layer === SearchAreaLayerEnum.SECOND_LAYER) {
      return trStationDataList.filter((trStationData) =>
        isStationBelowMainLine(trStationData, mainLine),
      );
    }
    return [];
  }, [
    deferredInput,
    params.layer,
    mainLine,
    isStationNameIncludesInput,
    isStationBelowMainLine,
  ]);

  return (
    <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
      {params.layer === SearchAreaLayerEnum.FIRST_LAYER &&
        !deferredInput &&
        trMainLines.map((trMainLine) => (
          <StationButton
            key={trMainLine.En}
            text={trMainLine[lang]}
            value={trMainLine.Zh_tw}
            onSelect={handleMainLineClick}
          />
        ))}
      {(params.layer === SearchAreaLayerEnum.SECOND_LAYER || deferredInput) &&
        filteredStations.map((trStationData) => (
          <StationButton
            key={trStationData.StationName.En}
            text={trStationData.StationName[lang]}
            value={trStationData.StationID}
            onSelect={handleStationSelect}
            isTopStation={["0", "1"].includes(trStationData.StationClass)}
          />
        ))}
    </div>
  );
};

/** [高鐵] 車站選擇 */
export const SelectThsrStation: FC = () => {
  const { i18n } = useTranslation();
  const lang = getTdxLang(i18n.language);
  const { params, isStationNameIncludesInput, handleStationSelect } =
    useStationSearch();

  const deferredInput = useDeferredValue(params.inputValue);

  const filteredStations = useMemo(
    () =>
      thsrStationDataList.filter((thSrStationData) =>
        deferredInput
          ? isStationNameIncludesInput(thSrStationData, deferredInput)
          : true,
      ),
    [deferredInput, isStationNameIncludesInput],
  );

  return (
    <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
      {(params.layer === SearchAreaLayerEnum.FIRST_LAYER || deferredInput) &&
        filteredStations.map((thSrStationData) => (
          <StationButton
            key={thSrStationData.StationName.En}
            text={thSrStationData.StationName[lang]}
            value={thSrStationData.StationID}
            onSelect={handleStationSelect}
          />
        ))}
    </div>
  );
};

/** [桃園捷運] 車站選擇 */
export const SelectTymcStation: FC = () => {
  const { i18n } = useTranslation();
  const lang = getTdxLang(i18n.language);
  const { params, isStationNameIncludesInput, handleStationSelect } =
    useStationSearch();

  const deferredInput = useDeferredValue(params.inputValue);

  const filteredStations = useMemo(
    () =>
      tymcStationDataList.filter((tymcStationData) =>
        deferredInput
          ? isStationNameIncludesInput(tymcStationData, deferredInput)
          : true,
      ),
    [deferredInput, isStationNameIncludesInput],
  );

  return (
    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
      {(params.layer === SearchAreaLayerEnum.FIRST_LAYER || deferredInput) &&
        filteredStations.map((tymcStationData) => (
          <StationButton
            key={tymcStationData.StationName.En}
            text={`${tymcStationData.StationID} ${tymcStationData.StationName[lang]}`}
            value={tymcStationData.StationID}
            onSelect={handleStationSelect}
          />
        ))}
    </div>
  );
};
