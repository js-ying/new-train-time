import { PageEnum } from "../../../enums/Page";
import { JsyThsrTrainTimeTable } from "../../../types/thsr-train-time-table";
import TrainTimeNavbar from "../TrainTimeNavbar";

/** 列車時刻表 */
const ThsrTrainTimeTable = ({
  page,
  data,
}: {
  page: PageEnum;
  data: JsyThsrTrainTimeTable;
}) => {
  return (
    <>
      <div className="mb-4">
        <TrainTimeNavbar
          page={page}
          trTrainTimeTable={null}
          filterTrTrainTimeTable={null}
          setFilterTrTrainTimeTable={null}
          thsrTrainTimeTable={data}
        />
      </div>

      <div className="flex flex-col gap-4">
        {/* {filterTrTrainTimeTable.map((data) => (
          <div key={data.TrainInfo.TrainNo}>
            <TrainTimeInfo page={page} data={data} />
          </div>
        ))} */}
      </div>
    </>
  );
};

export default ThsrTrainTimeTable;
