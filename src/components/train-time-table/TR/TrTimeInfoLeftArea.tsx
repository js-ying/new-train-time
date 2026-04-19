import { useTranslation } from "next-i18next";
import { FC } from "react";
import { JsyTrTimetable } from "../../../models/jsy-tr-info";

import { getNameLangKey } from "../../../utils/LocaleUtils";
import { getTrTrainTypeNameByCode } from "../../../utils/TrainInfoUtils";
import TrTrainType from "./TrTrainType";
import TrTripLine from "./TrTripLine";

interface TrTimeInfoLeftAreaProps {
  data: JsyTrTimetable;
}

const TrTimeInfoLeftArea: FC<TrTimeInfoLeftAreaProps> = ({ data }) => {
  const { i18n } = useTranslation();
  const langKey = getNameLangKey(i18n.language);

  return (
    <div className="flex flex-col gap-1.5">
      {/* 車號與山海線 */}
      <div className="text-sm">
        <TrTripLine
          trainNo={data.trainInfo.trainNo}
          tripLine={data.trainInfo.tripLine}
        />
      </div>

      {/* 車種 */}
      <div className="text-sm">
        <TrTrainType
          code={data.trainInfo.trainTypeCode}
          trainTypeName={getTrTrainTypeNameByCode(
            data.trainInfo.trainTypeCode,
            i18n.language,
          )}
        />
      </div>

      {/* 起迄站 */}
      <div className="text-sm">
        {data.trainInfo.startingStationName[langKey]} -{" "}
        {data.trainInfo.endingStationName[langKey]}
      </div>
    </div>
  );
};

export default TrTimeInfoLeftArea;
