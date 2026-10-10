import { getTrTripLineNameByValue } from "@/utils/TrainInfoUtils";
import { useTranslation } from "next-i18next";
import { FC } from "react";

interface TrTripLineProps {
  trainNo: string;
  tripLine: number;
}

const TrTripLine: FC<TrTripLineProps> = ({ trainNo, tripLine }) => {
  const { t } = useTranslation();

  return (
    <div>
      {trainNo} {getTrTripLineNameByValue(tripLine, t)}
    </div>
  );
};

export default TrTripLine;
