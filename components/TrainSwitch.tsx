import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useContext } from "react";
import {
  SearchAreaContext,
  SearchAreaUpdateContext,
} from "../contexts/SearchAreaContext";
import { PageEnum } from "../enums/PageEnum";
import { PathEnum } from "../enums/PathEnum";
import { SearchAreaActiveIndexEnum } from "../enums/SearchAreaParamsEnum";
import usePage from "../hooks/usePageHook";
import DateUtils from "../utils/date-utils";

/** 台鐵/高鐵切換器 */
const TrainSwitch = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { isTr, isThsr } = usePage();
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);

  const toggleTrainPage = () => {
    setParams({
      ...params,
      startStationId: null,
      endStationId: null,
      date: DateUtils.getCurrentDate(),
      time: DateUtils.getCurrentTime(),
      activeIndex: SearchAreaActiveIndexEnum.EMPTY,
    });

    if (isTr) {
      router.push({
        pathname: `${PathEnum[PageEnum.THSR + "Home"]}`,
      });
    }

    if (isThsr) {
      router.push({
        pathname: `${PathEnum[PageEnum.TR + "Home"]}`,
      });
    }
  };

  return (
    <div
      className="cursor-pointer rounded-md
        bg-grayBlue px-1 py-0.5 text-sm text-white transition
        duration-150 ease-out dark:bg-gamboge dark:text-zinc-900"
      onClick={toggleTrainPage}
    >
      {isTr && t(`${PageEnum.THSR}Toggle`)}
      {isThsr && t(`${PageEnum.TR}Toggle`)}
    </div>
  );
};

export default TrainSwitch;
