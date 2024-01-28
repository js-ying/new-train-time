import { useTranslation } from "next-i18next";
import { JsyTrTrainTimeTable } from "../../../types/tr-train-time-table";
import { getTdxLang } from "../../../utils/locale-utils";
import { getTrTrainTypeNameByCode } from "../../../utils/train-info-utils";
import TrTrainType from "./TrTrainType";
import TrTripLine from "./TrTripLine";

const TrTimeInfoLeftArea = ({ data }: { data: JsyTrTrainTimeTable }) => {
  const { i18n } = useTranslation();

  return (
    <div className="flex flex-col gap-1.5">
      {/* 車號與山海線 */}
      <div className="text-sm">
        <TrTripLine
          trainNo={data.TrainInfo.TrainNo}
          tripLine={data.TrainInfo.TripLine}
        />
      </div>

      {/* 車種 */}
      <div className="text-sm">
        <TrTrainType
          code={data.TrainInfo.TrainTypeCode}
          trainTypeName={getTrTrainTypeNameByCode(
            data.TrainInfo.TrainTypeCode,
            i18n.language,
          )}
        />
      </div>

      {/* 起迄站 */}
      <div className="text-sm">
        {data.TrainInfo.StartingStationName[getTdxLang(i18n.language)]} -{" "}
        {data.TrainInfo.EndingStationName[getTdxLang(i18n.language)]}
      </div>
    </div>
  );
};

export default TrTimeInfoLeftArea;
