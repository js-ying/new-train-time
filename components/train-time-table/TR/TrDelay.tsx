import { useTranslation } from "next-i18next";
import { TrDelayInfo } from "../../../types/tr-train-time-table";

const TrDelay = ({ data }: { data: TrDelayInfo[] }) => {
  const { t } = useTranslation();

  return (
    <>
      {data?.length > 0 && (
        <>
          {data[0].DelayTime === 0 ? (
            <div className="text-sm text-emerald-600 dark:text-emerald-400">
              {t("onTime")}
            </div>
          ) : (
            <div className="text-sm text-red-600 dark:text-red-400">
              {t("delay")} {data[0].DelayTime} {t("minute")}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default TrDelay;
