import { Button } from "@nextui-org/react";
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
import useLang from "../hooks/useLangHook";
import usePage from "../hooks/usePageHook";
import DateUtils from "../utils/DateUtils";

interface SwitchLabelProps {
  toPage: PageEnum;
}

const SwitchLabel: FC<SwitchLabelProps> = ({ toPage }) => {
  const { t } = useTranslation();
  const { isTw } = useLang();
  const router = useRouter();
  const { page } = usePage();
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);

  const toggleTrainPage = (toPage: PageEnum) => {
    setTimeout(() => {
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
    }, 300);
  };

  return (
    <Button
      className={`h-8 min-w-fit px-1.5 ${
        isTw ? "text-lg" : "text-base sm:text-lg"
      }
      ${
        page === toPage
          ? "bg-silverLakeBlue-500 text-white dark:bg-gamboge-500 dark:text-eerieBlack-500"
          : "bg-neutral-500 text-white dark:bg-neutral-600"
      }`}
      radius="sm"
      onClick={() => toggleTrainPage(toPage)}
    >
      {t(toPage)}
    </Button>
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
