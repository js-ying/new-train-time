import { GaEnum } from "@/enums/GaEnum";
import {
  ThsrDailyFreeSeatingCar,
  ThsrDailyTimetable,
  ThsrOdFare,
  ThsrTdxGeneralTimeTable,
} from "@/models/jsy-thsr-info";
import DateUtils from "@/utils/DateUtils";
import { gaClickEvent } from "@/utils/GaUtils";
import { isTrainPass } from "@/utils/TrainInfoUtils";
import { FC, useState } from "react";
import ThsrServiceDay from "./ThsrServiceDay";
import ThsrTimeInfoLeftArea from "./ThsrTimeInfoLeftArea";
import ThsrTimeInfoMidArea from "./ThsrTimeInfoMidArea";
import ThsrTimeInfoRightArea from "./ThsrTimeInfoRightArea";
import ThsrTrainTimeDetailDialog from "./ThsrTrainTimeDetailDialog";

interface ThsrTrainTimeInfoProps {
  thsrTrainTimeTable: ThsrDailyTimetable;
  thsrFreeSeatingCars: ThsrDailyFreeSeatingCar["FreeSeatingCars"];
  thsrTdxGeneralTimeTable: ThsrTdxGeneralTimeTable[];
  thsrOdFare: ThsrOdFare[];
}

/**
 * [高鐵] 列車時刻資訊
 */
const ThsrTrainTimeInfo: FC<ThsrTrainTimeInfoProps> = ({
  thsrTrainTimeTable,
  thsrFreeSeatingCars,
  thsrTdxGeneralTimeTable,
  thsrOdFare,
}) => {
  const [open, setOpen] = useState(false);
  const openDetail = () => {
    gaClickEvent(GaEnum.THSR_TRAIN_INFO);
    setOpen(true);
  };

  return (
    <div
      className={`${
        !open &&
        isTrainPass(
          thsrTrainTimeTable.TrainDate,
          DateUtils.getCurrentDate(),
          thsrTrainTimeTable?.OriginStopTime.DepartureTime,
        )
          ? "opacity-40"
          : ""
      }`}
    >
      <div
        tabIndex={0}
        role="button"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            openDetail();
          }
        }}
        className="custom-cursor-pointer relative grid grid-cols-4 items-center
          justify-between rounded-md border border-solid border-zinc-700 p-2
          transition duration-150 ease-out
          dark:border-zinc-200"
        onClick={openDetail}
      >
        <div className="text-center">
          <ThsrTimeInfoLeftArea data={thsrTrainTimeTable} />
        </div>
        <div className="col-span-2 text-center">
          <ThsrTimeInfoMidArea data={thsrTrainTimeTable} />
        </div>
        <div className="text-center">
          <ThsrTimeInfoRightArea
            trainNo={thsrTrainTimeTable.DailyTrainInfo.TrainNo}
            freeSeatData={thsrFreeSeatingCars}
          />
        </div>
      </div>
      <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        <ThsrServiceDay
          trainNo={thsrTrainTimeTable.DailyTrainInfo.TrainNo}
          generalTimeTable={thsrTdxGeneralTimeTable}
        />
      </div>

      {thsrTrainTimeTable && (
        <ThsrTrainTimeDetailDialog
          open={open}
          setOpen={setOpen}
          thsrTrainTimeTable={thsrTrainTimeTable}
          thsrFreeSeatingCars={thsrFreeSeatingCars}
          thsrTdxGeneralTimeTable={thsrTdxGeneralTimeTable}
          thsrOdFare={thsrOdFare}
        />
      )}
    </div>
  );
};

export default ThsrTrainTimeInfo;
