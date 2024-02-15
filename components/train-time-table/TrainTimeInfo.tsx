import { useContext, useState } from "react";
import { SearchAreaContext } from "../../contexts/SearchAreaContext";
import usePage from "../../hooks/usePageHook";
import {
  ThsrDailyFreeSeatingCar,
  ThsrDailyTimetable,
  ThsrOdFare,
  ThsrTdxGeneralTimeTable,
} from "../../types/thsr-train-time-table";
import { JsyTrTrainTimeTable } from "../../types/tr-train-time-table";
import DateUtils from "../../utils/date-utils";
import ThsrServiceDay from "./THSR/ThsrServiceDay";
import ThsrTimeInfoLeftArea from "./THSR/ThsrTimeInfoLeftArea";
import ThsrTimeInfoMidArea from "./THSR/ThsrTimeInfoMidArea";
import ThsrTimeInfoRightArea from "./THSR/ThsrTimeInfoRightArea";
import ThsrTrainTimeDetailDialog from "./THSR/ThsrTrainTimeDetailDialog";
import TrTimeInfoLeftArea from "./TR/TrTimeInfoLeftArea";
import TrTimeInfoMidArea from "./TR/TrTimeInfoMidArea";
import TrTimeInfoRightArea from "./TR/TrTimeInfoRightArea";
import TrTrainService from "./TR/TrTrainServices";
import TrTrainTimeDetailDialog from "./TR/TrTrainTimeDetailDialog";

const isTrainPass = (
  date: string,
  currentDate: string,
  departureTime: string,
): boolean => {
  // 若查詢日期與當下日期相同
  if (date === currentDate) {
    const trainDatetime = new Date(
      `${date.replace(/-/g, "/")} ${departureTime}`,
    );
    const nowDatetime = new Date();
    // 若火車時間小於當下時間則代表火車已過時
    if (trainDatetime < nowDatetime) {
      return true;
    }
  }

  return false;
};

/**
 * 列車時刻資訊
 */
const TrainTimeInfo = ({
  trTrainTimeTable,
  thsrTrainTimeTable,
  thsrDailyFreeSeatingCar,
  thsrTdxGeneralTimeTable,
  thsrOdFare,
}: {
  trTrainTimeTable: JsyTrTrainTimeTable;
  thsrTrainTimeTable: ThsrDailyTimetable;
  thsrDailyFreeSeatingCar: ThsrDailyFreeSeatingCar;
  thsrTdxGeneralTimeTable: ThsrTdxGeneralTimeTable[];
  thsrOdFare: ThsrOdFare[];
}) => {
  const { isTr, isThsr } = usePage();

  const params = useContext(SearchAreaContext);

  const [open, setOpen] = useState(false);
  const openDetail = () => {
    setOpen(true);
  };

  return (
    <div
      className={`${
        isTrainPass(
          params.date,
          DateUtils.getCurrentDate(),
          trTrainTimeTable?.StopTimes[0].DepartureTime ||
            thsrTrainTimeTable?.OriginStopTime.DepartureTime,
        )
          ? "opacity-40"
          : ""
      }`}
    >
      <div
        className="relative grid cursor-pointer grid-cols-4 items-center
          justify-between rounded-md border border-solid border-zinc-700 p-2
          transition duration-150 ease-out
          dark:border-zinc-200"
        onClick={openDetail}
      >
        <div className="text-center">
          {isTr && <TrTimeInfoLeftArea data={trTrainTimeTable} />}
          {isThsr && <ThsrTimeInfoLeftArea data={thsrTrainTimeTable} />}
        </div>
        <div className="col-span-2 text-center">
          {isTr && <TrTimeInfoMidArea data={trTrainTimeTable} />}
          {isThsr && <ThsrTimeInfoMidArea data={thsrTrainTimeTable} />}
        </div>
        <div className="text-center">
          {isTr && <TrTimeInfoRightArea data={trTrainTimeTable} />}
          {isThsr && (
            <ThsrTimeInfoRightArea
              trainNo={thsrTrainTimeTable.DailyTrainInfo.TrainNo}
              freeSeatData={thsrDailyFreeSeatingCar}
            />
          )}
        </div>
        <div className="absolute right-1.5 top-1.5 flex gap-1">
          {isTr && <TrTrainService data={trTrainTimeTable.TrainInfo} />}
        </div>
      </div>
      <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        {isTr && trTrainTimeTable.TrainInfo.Note}
        {isThsr && (
          <ThsrServiceDay
            trainNo={thsrTrainTimeTable.DailyTrainInfo.TrainNo}
            generalTimeTable={thsrTdxGeneralTimeTable}
          />
        )}
      </div>

      {trTrainTimeTable && (
        <TrTrainTimeDetailDialog
          open={open}
          setOpen={setOpen}
          data={trTrainTimeTable}
        />
      )}

      {thsrTrainTimeTable && (
        <ThsrTrainTimeDetailDialog
          open={open}
          setOpen={setOpen}
          thsrTrainTimeTable={thsrTrainTimeTable}
          thsrDailyFreeSeatingCar={thsrDailyFreeSeatingCar}
          thsrTdxGeneralTimeTable={thsrTdxGeneralTimeTable}
          thsrOdFare={thsrOdFare}
        />
      )}
    </div>
  );
};

export default TrainTimeInfo;
