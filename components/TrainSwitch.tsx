import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useContext } from "react";
import {
  SearchAreaContext,
  SearchAreaUpdateContext,
} from "../contexts/SearchAreaContext";
import { PageEnum } from "../enums/Page";
import { PathEnum } from "../enums/Path";
import { SearchAreaActiveIndexEnum } from "../enums/SearchAreaParamsEnum";
import DateUtils from "../utils/date-utils";

/** 台鐵/高鐵切換器 */
const TrainSwitch = ({ page = PageEnum.TR }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const isTr = page === PageEnum.TR;
  const isThsr = page === PageEnum.THSR;
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
      className="dark:bg-gamboge cursor-pointer
        rounded-md bg-grayBlue px-1 py-0.5 text-sm text-white
        transition duration-150 ease-out dark:text-zinc-900"
      onClick={toggleTrainPage}
    >
      {isTr && t(PageEnum.THSR + "Toggle")}
      {isThsr && t(PageEnum.TR + "Toggle")}
    </div>
  );
};

export default TrainSwitch;
