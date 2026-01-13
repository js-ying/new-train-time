import { useTranslation } from "next-i18next";
import { FC } from "react";
import { JsyTimeTable } from "../../../models/jsy-thsr-info";
import ThsrAvailableSeatStatus, {
  isThsrAvailable,
} from "./ThsrAvailableSeatStatus";
import ThsrOrderButton, { isShowThsrOrderBtn } from "./ThsrOrderButton";

interface ThsrTimeInfoRightAreaProps {
  data: JsyTimeTable;
}

const ThsrTimeInfoRightArea: FC<ThsrTimeInfoRightAreaProps> = ({ data }) => {
  const { t } = useTranslation();

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
