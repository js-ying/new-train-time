import { TrTrainTimeTable } from "../../../types/tr-train-time-table";
import { getTdxLang } from "../../../utils/locale-utils";
import {
  getTrTrainTypeNameByCode,
  getTrTripLineNameByValue,
} from "../../../utils/train-info-utils";

const TrTrainType = ({ code, trainTypeName }) => {
  return (
    <>
      {/* 自強 */}
      {["3", "11"].includes(code) && (
        <span className={"rounded bg-teal-500 px-1 py-0.5 text-white"}>
          {trainTypeName}
        </span>
      )}

      {/* 區間 */}
      {["6", "7", "10"].includes(code) && (
        <span className={"rounded bg-sky-500 px-1 py-0.5 text-white"}>
          {trainTypeName}
        </span>
      )}

      {/* 大魯閣 */}
      {["1"].includes(code) && (
        <span className={"rounded bg-indigo-500 px-1 py-0.5 text-white"}>
          {trainTypeName}
        </span>
      )}

      {/* 普悠瑪 */}
      {["2"].includes(code) && (
        <span className={"rounded bg-rose-500 px-1 py-0.5 text-white"}>
          {trainTypeName}
        </span>
      )}

      {/* 莒光號 */}
      {["4"].includes(code) && (
        <span className={"rounded bg-amber-500 px-1 py-0.5 text-white"}>
          {trainTypeName}
        </span>
      )}

      {/* 復興 */}
      {["5"].includes(code) && (
        <span className={"rounded bg-amber-500 px-1 py-0.5 text-white"}>
          {trainTypeName}
        </span>
      )}
    </>
  );
};

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
        {data.TrainInfo.TrainNo}{" "}
        {getTrTripLineNameByValue(data.TrainInfo.TripLine, lang)}
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
        {data.TrainInfo.StartingStationName[getTdxLang(lang)]}-
        {data.TrainInfo.EndingStationName[getTdxLang(lang)]}
      </div>
    </div>
  );
};

export default TrTimeInfoLeftArea;
