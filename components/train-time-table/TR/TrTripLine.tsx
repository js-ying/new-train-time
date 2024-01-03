import { useTranslation } from "next-i18next";
import { getTrTripLineNameByValue } from "../../../utils/train-info-utils";

const TrTripLine = ({
  trainNo,
  tripLine,
}: {
  trainNo: string;
  tripLine: number;
}) => {
  const { i18n } = useTranslation();

  return (
    <div>
      {trainNo} {getTrTripLineNameByValue(tripLine, i18n.language)}
    </div>
  );
};

export default TrTripLine;
