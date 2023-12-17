import { useState } from "react";
import { PageEnum } from "../../enums/Page";
import { TrTrainTimeTable } from "../../types/tr-train-time-table";
import TrainTimeInfo from "./TrainTimeInfo";
import TrainTimeNavbar from "./TrainTimeNavbar";

/** 列車時刻表 */
const TrainTimeTable = ({
  page,
  dataList,
}: {
  page: PageEnum;
  dataList: TrTrainTimeTable[];
}) => {
  const [filterDataList, setFilterDataList] = useState([...dataList]);

  return (
    <>
      <div className="mb-4">
        <TrainTimeNavbar
          page={page}
          dataList={dataList}
          filterDataList={filterDataList}
          setFilterDataList={setFilterDataList}
        />
      </div>

      <div className="flex flex-col gap-4">
        {filterDataList.map((data, index) => (
          <div key={index}>
            <TrainTimeInfo page={page} data={data} />
          </div>
        ))}
      </div>
    </>
  );
};

export default TrainTimeTable;
