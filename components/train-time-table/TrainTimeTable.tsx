import { useEffect, useState } from "react";
import { PageEnum } from "../../enums/Page";
import { JsyTrTrainTimeTable } from "../../types/tr-train-time-table";
import TrainTimeInfo from "./TrainTimeInfo";
import TrainTimeNavbar from "./TrainTimeNavbar";

/** 列車時刻表 */
const TrainTimeTable = ({
  page,
  dataList,
}: {
  page: PageEnum;
  dataList: JsyTrTrainTimeTable[];
}) => {
  const [filterDataList, setFilterDataList] = useState(dataList);

  useEffect(() => {
    setFilterDataList([...dataList]);
  }, [dataList]);

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
        {filterDataList.map((data) => (
          <div key={data.TrainInfo.TrainNo}>
            <TrainTimeInfo page={page} data={data} />
          </div>
        ))}
      </div>
    </>
  );
};

export default TrainTimeTable;
