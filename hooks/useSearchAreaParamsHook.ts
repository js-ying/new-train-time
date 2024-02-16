import { useRouter } from "next/router";
import { SearchAreaParams } from "../contexts/SearchAreaContext";
import {
  SearchAreaActiveIndexEnum,
  SearchAreaLayerEnum,
} from "../enums/SearchAreaParamsEnum";
import DateUtils from "../utils/DateUtils";

interface UseSearchAreaParamsResult {
  urlSearchAreaParams: SearchAreaParams;
}

const useSearchAreaParams = (): UseSearchAreaParamsResult => {
  const router = useRouter();

  const urlSearchAreaParams = {
    startStationId: router.query.s as string,
    endStationId: router.query.e as string,
    date: router.query.d as string,
    time: DateUtils.getTimeByUrlParam(router.query.t as string),
    activeIndex: SearchAreaActiveIndexEnum.EMPTY,
    layer: SearchAreaLayerEnum.FIRST_LAYER,
    inputValue: "",
  };

  return { urlSearchAreaParams };
};

export default useSearchAreaParams;
