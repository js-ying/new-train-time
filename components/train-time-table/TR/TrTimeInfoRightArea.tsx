import { FC } from "react";
import { JsyTrTrainTimeTable } from "../../../types/tr-train-time-table";

interface TrTimeInfoRightAreaProps {
  data: JsyTrTrainTimeTable;
}

const TrTimeInfoRightArea: FC<TrTimeInfoRightAreaProps> = ({ data }) => {
  return (
    <>
      <span title="全票票價" className="text-sm">
        NTD {data.fareList.length > 0 && data.fareList[0].Price}
      </span>
    </>
  );
};

export default TrTimeInfoRightArea;
