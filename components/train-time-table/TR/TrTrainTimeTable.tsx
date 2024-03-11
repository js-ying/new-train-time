import { FC, useEffect, useState } from "react";
import { JsyTrTrainTimeTable } from "../../../types/tr-train-time-table";
import TrainTimeNavbar from "../TrainTimeNavbar";
import TrTrainTimeInfo from "./TrTrainTimeInfo";
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
      <div className="mb-2 pb-2 pt-2">
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
            <TrTrainTimeInfo trTrainTimeTable={data} />
          </div>
        ))}
      </div>
    </>
  );
};

export default TrTrainTimeTable;
