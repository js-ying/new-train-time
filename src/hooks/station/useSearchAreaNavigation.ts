import {
  SearchAreaContext,
  SearchAreaUpdateContext,
} from "@/contexts/SearchAreaContext";
import {
  SearchAreaActiveIndexEnum,
  SearchAreaLayerEnum,
} from "@/enums/SearchAreaParamsEnum";
import { useContext } from "react";

export const useSearchAreaNavigation = () => {
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);

  const handleStationAreaClick = (
    clickIndex: number,
    activeIndex: SearchAreaActiveIndexEnum,
  ) => {
    // 若還沒點選過任何 Area，或是點擊的與已選的 Area 不同
    if (activeIndex === null || activeIndex !== clickIndex) {
      setParams({
        ...params,
        activeIndex: clickIndex,
        layer: SearchAreaLayerEnum.FIRST_LAYER,
        inputValue: "",
      });
    } else {
      // 若此次點擊與已點選的 Area 相同，且在第一層
      if (params.layer === SearchAreaLayerEnum.FIRST_LAYER) {
        setParams({
          ...params,
          activeIndex: SearchAreaActiveIndexEnum.EMPTY,
          layer: SearchAreaLayerEnum.FIRST_LAYER,
          inputValue: "",
        });
      } else {
        setParams({
          ...params,
          layer: SearchAreaLayerEnum.FIRST_LAYER,
          inputValue: "",
        });
      }
    }
  };

  return {
    params,
    handleStationAreaClick,
  };
};
