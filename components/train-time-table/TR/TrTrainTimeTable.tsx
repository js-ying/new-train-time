import { useEffect, useState } from "react";
import { PageEnum } from "../../../enums/Page";
import { JsyTrTrainTimeTable } from "../../../types/tr-train-time-table";
import TrainTimeInfo from "../TrainTimeInfo";
import TrainTimeNavbar from "../TrainTimeNavbar";

/** 列車時刻表 */
const TrTrainTimeTable = ({
  page,
  dataList,
}: {
  page: PageEnum;
  dataList: JsyTrTrainTimeTable[];
}) => {
  const [filterTrTrainTimeTable, setFilterTrTrainTimeTable] =
    useState(dataList);

  useEffect(() => {
    setFilterTrTrainTimeTable([...dataList]);
  }, [dataList]);

  return (
    <>
      <div className="mb-4">
        <TrainTimeNavbar
          page={page}
          trTrainTimeTable={dataList}
          filterTrTrainTimeTable={filterTrTrainTimeTable}
          setFilterTrTrainTimeTable={setFilterTrTrainTimeTable}
          thsrTrainTimeTable={null}
        />
      </div>

      <div className="flex flex-col gap-4">
        {filterTrTrainTimeTable.map((data) => (
          <div key={data.TrainInfo.TrainNo}>
            <TrainTimeInfo
              page={page}
              trTrainTimeTable={data}
              thsrTrainTimeTable={null}
              thsrDailyFreeSeatingCar={null}
              thsrGeneralTimeTable={null}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default TrTrainTimeTable;
