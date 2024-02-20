import { FC } from "react";
import { JsyThsrTrainTimeTable } from "../../../types/thsr-train-time-table";
import TrainTimeInfo from "../TrainTimeInfo";
import TrainTimeNavbar from "../TrainTimeNavbar";
import ThsrPriceInfo from "./ThsrPriceInfo";

interface ThsrTrainTimeTableProps {
  data: JsyThsrTrainTimeTable;
}

/** 列車時刻表 */
const ThsrTrainTimeTable: FC<ThsrTrainTimeTableProps> = ({ data }) => {
  return (
    <>
      <div className="mb-4">
        <TrainTimeNavbar totalCount={data.timeTable.length} filterCount={null}>
          <ThsrPriceInfo dataList={data.fareList} showAll={false} />
        </TrainTimeNavbar>
      </div>

      <div className="flex flex-col gap-4">
        {data.timeTable.map((timeTable) => (
          <div key={timeTable.DailyTrainInfo.TrainNo}>
            <TrainTimeInfo
              trTrainTimeTable={null}
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
