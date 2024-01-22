import { useTranslation } from "next-i18next";
import { TrDelayInfo } from "../../../types/tr-train-time-table";

const TrDelay = ({ dataList }: { dataList: TrDelayInfo[] }) => {
  const { t } = useTranslation();

  return (
    <>
      {dataList?.length > 0 && (
        <>
          {dataList[0].DelayTime === 0 ? (
            <div className="text-sm text-emerald-600 dark:text-emerald-400">
              {t("onTime")}
            </div>
          ) : (
            <div className="text-sm text-red-600 dark:text-red-400">
              {t("delay")} {dataList[0].DelayTime} {t("minute")}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default TrDelay;
