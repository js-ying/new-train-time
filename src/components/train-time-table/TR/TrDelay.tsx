import { useTranslation } from "next-i18next";
import { FC } from "react";
import { JsyTrDelay } from "../../../models/jsy-tr-info";

interface DelayDotProps {
  isGreen: boolean;
}

const DelayDot: FC<DelayDotProps> = ({ isGreen }) => {
  return (
    <>
      {isGreen && <span className="dot bg-success"></span>}
      {!isGreen && <span className="dot bg-danger"></span>}
    </>
  );
};

interface TrDelayProps {
  dataList: JsyTrDelay[];
}

const TrDelay: FC<TrDelayProps> = ({ dataList }) => {
  const { t } = useTranslation();

  return (
    <>
      {dataList?.length > 0 && (
        <>
          {dataList[0].delayTime === 0 ? (
            <span className="relative text-sm text-success">
              {t("onTime")}
              <DelayDot isGreen={true}></DelayDot>
            </span>
          ) : (
            <span className="relative text-sm text-danger">
              {t("delay")} {dataList[0].delayTime} {t("minute")}
              <DelayDot isGreen={false}></DelayDot>
            </span>
          )}
        </>
      )}
    </>
  );
};

export default TrDelay;
