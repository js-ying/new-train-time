import { FC } from "react";
import { JsyTrTrainTimeTable } from "../../../types/tr-train-time-table";
import TrOrder, { isShowTrOrderBtn } from "./TrOrder";

interface TrTimeInfoRightAreaProps {
  data: JsyTrTrainTimeTable;
}

const TrTimeInfoRightArea: FC<TrTimeInfoRightAreaProps> = ({ data }) => {
  return (
    <div
      className={`flex flex-col gap-0.5 ${
        isShowTrOrderBtn(data) ? "my-5" : ""
      }`}
    >
      <span className="text-sm">
        NTD {data.fareList.length > 0 && data.fareList[0].Price}
      </span>

      {isShowTrOrderBtn(data) && <TrOrder data={data} />}
    </div>
  );
};

export default TrTimeInfoRightArea;
