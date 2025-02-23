import { useTranslation } from "next-i18next";
import { FC } from "react";
import { TrDelayInfo } from "../../../models/tr-train-time-table";

interface DelayDotProps {
  isGreen: boolean;
}

const DelayDot: FC<DelayDotProps> = ({ isGreen }) => {
  return (
    <>
      {isGreen && (
        <span className="dot bg-emerald-600 dark:bg-emerald-400"></span>
      )}
      {!isGreen && <span className="dot bg-red-600 dark:bg-red-400"></span>}
    </>
  );
};

interface TrDelayProps {
  dataList: TrDelayInfo[];
}

const TrDelay: FC<TrDelayProps> = ({ dataList }) => {
  const { t } = useTranslation();

  return (
    <>
      {dataList?.length > 0 && (
        <>
          {dataList[0].DelayTime === 0 ? (
            <span className="relative text-sm text-emerald-600 dark:text-emerald-400">
              {t("onTime")}
              <DelayDot isGreen={true}></DelayDot>
            </span>
          ) : (
            <span className="relative text-sm text-red-600 dark:text-red-400">
              {t("delay")} {dataList[0].DelayTime} {t("minute")}
              <DelayDot isGreen={false}></DelayDot>
            </span>
          )}
        </>
      )}
    </>
  );
};

export default TrDelay;
