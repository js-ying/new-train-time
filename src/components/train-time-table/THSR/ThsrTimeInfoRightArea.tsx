import { useTranslation } from "next-i18next";
import { FC } from "react";
import { JsyThsrInfo } from "../../../models/jsy-thsr-info";
import ThsrFreeSeat from "./ThsrFreeSeat";

interface ThsrTimeInfoRightAreaProps {
  trainNo: string;
  freeSeatData: JsyThsrInfo["freeSeatingCars"];
}

const ThsrTimeInfoRightArea: FC<ThsrTimeInfoRightAreaProps> = ({
  trainNo,
  freeSeatData,
}) => {
  const { t } = useTranslation();

  return (
    <div className="text-sm">
      <div className="mb-1">{t("freeSeating")}</div>

      <ThsrFreeSeat
        freeSeatData={freeSeatData}
        trainNo={trainNo}
        showLabel={true}
      />
    </div>
  );
};

export default ThsrTimeInfoRightArea;
