import { useTranslation } from "next-i18next";
import { FC } from "react";
import { getTrTripLineNameByValue } from "../../../utils/TrainInfoUtils";

interface TrTripLineProps {
  trainNo: string;
  tripLine: number;
}

const TrTripLine: FC<TrTripLineProps> = ({ trainNo, tripLine }) => {
  const { i18n } = useTranslation();

  return (
    <div>
      {trainNo} {getTrTripLineNameByValue(tripLine, i18n.language)}
    </div>
  );
};

export default TrTripLine;
