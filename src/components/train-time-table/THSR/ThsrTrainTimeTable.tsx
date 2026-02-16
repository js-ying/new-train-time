import AdBanner from "@/components/common/AdBanner";
import { JsyThsrInfo } from "@/models/jsy-thsr-info";
import AdUtils from "@/utils/AdUtils";
import { FC } from "react";
import TrainTimeNavbar from "../TrainTimeNavbar";
import ThsrPriceInfo from "./ThsrPriceInfo";
import ThsrTrainTimeInfo from "./ThsrTrainTimeInfo";

interface ThsrTrainTimeTableProps {
  data: JsyThsrInfo;
}

/** 列車時刻表 */
const ThsrTrainTimeTable: FC<ThsrTrainTimeTableProps> = ({ data }) => {
  return (
    <>
      <div className="sticky top-0 z-10 mb-2 bg-white pb-2 pt-2 dark:bg-eerieBlack-500">
        <TrainTimeNavbar totalCount={data.timeTables.length} filterCount={null}>
          <ThsrPriceInfo dataList={data.fareList} showLabel={true} />
        </TrainTimeNavbar>
      </div>

      <div className="flex flex-col gap-4">
        {data.timeTables.map((timeTable, index) => (
          <div key={timeTable.DailyTrainInfo.TrainNo}>
            <ThsrTrainTimeInfo
              thsrTrainTimeTable={timeTable}
              thsrFreeSeatingCars={data.freeSeatingCars}
              thsrTdxGeneralTimeTable={data.generalTimeTable}
              thsrOdFare={data.fareList}
              isGeneralTimetable={data.isGeneralTimetable}
            />

            {AdUtils.showAd(data.timeTables.length, index) && (
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

export default ThsrTrainTimeTable;
