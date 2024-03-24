import { FC } from "react";
import { JsyThsrTrainTimeTable } from "../../../types/thsr-train-time-table";
import TrainTimeNavbar from "../TrainTimeNavbar";
import ThsrPriceInfo from "./ThsrPriceInfo";
import ThsrTrainTimeInfo from "./ThsrTrainTimeInfo";

interface ThsrTrainTimeTableProps {
  data: JsyThsrTrainTimeTable;
}

/** 列車時刻表 */
const ThsrTrainTimeTable: FC<ThsrTrainTimeTableProps> = ({ data }) => {
  return (
    <>
      <div className="dark:bg-eerieBlack-500 sticky top-0 z-50 mb-2 bg-white pb-2 pt-2">
        <TrainTimeNavbar totalCount={data.timeTable.length} filterCount={null}>
          <ThsrPriceInfo dataList={data.fareList} showLabel={true} />
        </TrainTimeNavbar>
      </div>

      <div className="flex flex-col gap-4">
        {data.timeTable.map((timeTable) => (
          <div key={timeTable.DailyTrainInfo.TrainNo}>
            <ThsrTrainTimeInfo
              thsrTrainTimeTable={timeTable}
              thsrDailyFreeSeatingCar={data.dailyFreeSeatingCar}
              thsrTdxGeneralTimeTable={data.generalTimeTable}
              thsrOdFare={data.fareList}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default ThsrTrainTimeTable;
