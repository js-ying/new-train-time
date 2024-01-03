import { TrTrainTimeTable } from "../../../types/tr-train-time-table";
import { getTdxLang } from "../../../utils/locale-utils";
import { getTrTrainTypeNameByCode } from "../../../utils/train-info-utils";
import TrTrainType from "./TrTrainType";
import TrTripLine from "./TrTripLine";

const TrTimeInfoLeftArea = ({
  data,
  lang,
}: {
  data: TrTrainTimeTable;
  lang: string;
}) => {
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
            lang,
          )}
        />
      </div>

      {/* 起迄站 */}
      <div className="text-sm">
        {data.TrainInfo.StartingStationName[getTdxLang(lang)]} -{" "}
        {data.TrainInfo.EndingStationName[getTdxLang(lang)]}
      </div>
    </div>
  );
};

export default TrTimeInfoLeftArea;
