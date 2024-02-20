import { FC, useEffect, useState } from "react";
import { JsyTrTrainTimeTable } from "../../../types/tr-train-time-table";
import TrainTimeInfo from "../TrainTimeInfo";
import TrainTimeNavbar from "../TrainTimeNavbar";
import TrTrainTypeFilter from "./TrTrainTypeFilter";

interface TrTrainTimeTableProps {
  dataList: JsyTrTrainTimeTable[];
}

/** 列車時刻表 */
const TrTrainTimeTable: FC<TrTrainTimeTableProps> = ({ dataList }) => {
  const [filterTrTrainTimeTable, setFilterTrTrainTimeTable] =
    useState(dataList);

  useEffect(() => {
    setFilterTrTrainTimeTable([...dataList]);
  }, [dataList]);

  return (
    <>
      <div className="mb-4">
        <TrainTimeNavbar
          totalCount={dataList.length}
          filterCount={filterTrTrainTimeTable.length}
        >
          <TrTrainTypeFilter
            dataList={dataList}
            setFilterDataList={setFilterTrTrainTimeTable}
          />
        </TrainTimeNavbar>
      </div>

      <div className="flex flex-col gap-4">
        {filterTrTrainTimeTable.map((data) => (
          <div key={data.TrainInfo.TrainNo}>
            <TrainTimeInfo
              trTrainTimeTable={data}
              thsrTrainTimeTable={null}
              thsrDailyFreeSeatingCar={null}
              thsrTdxGeneralTimeTable={null}
              thsrOdFare={null}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default TrTrainTimeTable;
