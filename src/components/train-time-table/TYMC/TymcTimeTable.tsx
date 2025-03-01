import AdBanner from "@/components/AdBanner";
import { JsyTymcInfo } from "@/models/jsy-tymc-info";
import AdUtils from "@/utils/AdUtils";
import { FC, useEffect, useState } from "react";
import TrainTimeNavbar from "../TrainTimeNavbar";
import TymcTimeInfo from "./TymcTimeInfo";
import TymcTrainTypeFilter from "./TymcTrainTypeFilter";

interface TymcTimeTableProps {
  data: JsyTymcInfo;
}

/** 列車時刻表 */
const TymcTimeTable: FC<TymcTimeTableProps> = ({ data }) => {
  const [filterTymcTrainTimeTable, setFilterTymcTrainTimeTable] = useState(
    data.timeTables,
  );

  useEffect(() => {
    setFilterTymcTrainTimeTable([...data.timeTables]);
  }, [data.timeTables]);

  return (
    <>
      <div className="mb-2 bg-white pb-2 pt-2 dark:bg-eerieBlack-500">
        <TrainTimeNavbar
          totalCount={data.timeTables.length}
          filterCount={filterTymcTrainTimeTable.length}
        >
          <TymcTrainTypeFilter
            dataList={data.timeTables}
            setFilterDataList={setFilterTymcTrainTimeTable}
          />
        </TrainTimeNavbar>
      </div>

      <div className="flex flex-col gap-4">
        {filterTymcTrainTimeTable.map((timeTable, index) => (
          <div
            key={`${data.startStationId} ${data.endStationId} ${data.date} ${data.time} ${timeTable.Sequence} ${timeTable.TrainType} ${timeTable.DepartureTime}`}
          >
            <TymcTimeInfo
              tymcTimeTable={timeTable}
              trainDate={data.date}
              fareList={data.fareList}
              startStationId={data.startStationId}
              endStationId={data.endStationId}
            />

            {AdUtils.showAd(filterTymcTrainTimeTable.length, index) && (
              <div className="mt-4">
                <AdBanner />
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default TymcTimeTable;
