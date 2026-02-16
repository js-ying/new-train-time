import { useTranslation } from "next-i18next";
import { FC } from "react";
import { ThsrDailyTimetable } from "../../../models/jsy-thsr-info";

import ThsrAvailableSeatStatus, {
  isThsrAvailable,
} from "./ThsrAvailableSeatStatus";
import ThsrOrderButton, { isShowThsrOrderBtn } from "./ThsrOrderButton";

interface ThsrTimeInfoRightAreaProps {
  data: ThsrDailyTimetable;
  isGeneralTimetable: boolean;
}

const ThsrTimeInfoRightArea: FC<ThsrTimeInfoRightAreaProps> = ({
  data,
  isGeneralTimetable,
}) => {
  const { t } = useTranslation();

  if (isGeneralTimetable) {
    return (
      <span className="text-sm text-zinc-500 dark:text-zinc-400">
        {t("unavailableOrder")}
      </span>
    );
  }

  return (
    <div className="my-2 flex flex-col items-center justify-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400">
      {isShowThsrOrderBtn(data) ? (
        <>
          <ThsrAvailableSeatStatus timeTable={data} />
          {isThsrAvailable(data) && <ThsrOrderButton timeTable={data} />}
        </>
      ) : (
        <span>{t("unavailableOrder")}</span>
      )}
    </div>
  );
};

export default ThsrTimeInfoRightArea;
