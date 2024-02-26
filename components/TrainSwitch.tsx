import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { FC, useContext } from "react";
import {
  SearchAreaContext,
  SearchAreaUpdateContext,
} from "../contexts/SearchAreaContext";
import { PageEnum } from "../enums/PageEnum";
import { PathEnum } from "../enums/PathEnum";
import { SearchAreaActiveIndexEnum } from "../enums/SearchAreaParamsEnum";
import usePage from "../hooks/usePageHook";
import DateUtils from "../utils/DateUtils";

interface SwitchLabelProps {
  toPage: PageEnum;
}

const SwitchLabel: FC<SwitchLabelProps> = ({ toPage }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { page } = usePage();
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);

  const toggleTrainPage = (toPage: PageEnum) => {
    setParams({
      ...params,
      startStationId: null,
      endStationId: null,
      date: DateUtils.getCurrentDate(),
      time: DateUtils.getCurrentTime(),
      activeIndex: SearchAreaActiveIndexEnum.EMPTY,
    });

    if (toPage === PageEnum.TR) {
      router.push({
        pathname: `${PathEnum[PageEnum.TR + "Home"]}`,
      });
    }
    if (toPage === PageEnum.THSR) {
      router.push({
        pathname: `${PathEnum[PageEnum.THSR + "Home"]}`,
      });
    }
  };

  return (
    <span
      className={`${
        page === toPage
          ? "border bg-grayBlue px-1 text-white dark:bg-gamboge"
          : ""
      } cursor-pointer rounded-md border border-grayBlue px-1 dark:border-gamboge`}
      onClick={() => toggleTrainPage(toPage)}
    >
      {t(toPage)}
    </span>
  );
};

/** 台鐵/高鐵切換器 */
const TrainSwitch: FC = () => {
  return (
    <div className="flex items-center gap-1">
      <SwitchLabel toPage={PageEnum.TR} />
      <SwitchLabel toPage={PageEnum.THSR} />
    </div>
  );
};

export default TrainSwitch;
