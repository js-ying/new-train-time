import { JsyTrTimetable } from "@/models/jsy-tr-info";

import { FC } from "react";
import TrOrder, { isShowTrOrderBtn } from "./TrOrder";

interface TrTimeInfoRightAreaProps {
  data: JsyTrTimetable;
}

const TrTimeInfoRightArea: FC<TrTimeInfoRightAreaProps> = ({ data }) => {
  return (
    <div className={`flex flex-col gap-0.5`}>
      <span className="text-sm">
        NTD {data.fareList.length > 0 && data.fareList[0].price}
      </span>

      {isShowTrOrderBtn(data) && <TrOrder data={data} />}
    </div>
  );
};

export default TrTimeInfoRightArea;
