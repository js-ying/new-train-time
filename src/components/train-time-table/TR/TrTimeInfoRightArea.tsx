import { TrDailyTrainTimetable } from "@/models/jsy-tr-info";

import { FC } from "react";
import TrOrder, { isShowTrOrderBtn } from "./TrOrder";

interface TrTimeInfoRightAreaProps {
  data: TrDailyTrainTimetable;
}

const TrTimeInfoRightArea: FC<TrTimeInfoRightAreaProps> = ({ data }) => {
  return (
    <div className={`flex flex-col gap-0.5`}>
      <span className="text-sm">
        NTD {data.jsyFareList.length > 0 && data.jsyFareList[0].Price}
      </span>

      {isShowTrOrderBtn(data) && <TrOrder data={data} />}
    </div>
  );
};

export default TrTimeInfoRightArea;
