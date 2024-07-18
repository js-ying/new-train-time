import { FC, useState } from "react";
import useLang from "../../../hooks/useLangHook";
import { JsyTrTrainTimeTable } from "../../../types/tr-train-time-table";
import DateUtils from "../../../utils/DateUtils";
import { isTrainPass } from "../../../utils/TrainInfoUtils";
import TrTimeInfoLeftArea from "../TR/TrTimeInfoLeftArea";
import TrTimeInfoMidArea from "../TR/TrTimeInfoMidArea";
import TrTimeInfoRightArea from "../TR/TrTimeInfoRightArea";
import TrTrainTimeDetailDialog from "../TR/TrTrainTimeDetailDialog";
import TrTrainService from "./TrTrainServices";

interface TrTrainTimeInfoProps {
  trTrainTimeTable: JsyTrTrainTimeTable;
}

/**
 * [台鐵] 列車時刻資訊
 */
const TrTrainTimeInfo: FC<TrTrainTimeInfoProps> = ({ trTrainTimeTable }) => {
  const [open, setOpen] = useState(false);
  const openDetail = () => {
    setOpen(true);
  };

  const { isTw } = useLang();

  return (
    <div
      className={`${
        isTrainPass(
          trTrainTimeTable.trainDate,
          DateUtils.getCurrentDate(),
          trTrainTimeTable?.StopTimes[0].DepartureTime,
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
          <TrTimeInfoLeftArea data={trTrainTimeTable} />
        </div>
        <div className="col-span-2 text-center">
          <TrTimeInfoMidArea data={trTrainTimeTable} />
        </div>
        <div className="text-center">
          <TrTimeInfoRightArea data={trTrainTimeTable} />
        </div>
        <div className="absolute right-1.5 top-1.5 flex gap-1">
          <TrTrainService data={trTrainTimeTable.TrainInfo} />
        </div>
      </div>

      <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        {isTw && trTrainTimeTable.TrainInfo.Note}
      </div>

      {trTrainTimeTable && (
        <TrTrainTimeDetailDialog
          open={open}
          setOpen={setOpen}
          data={trTrainTimeTable}
        />
      )}
    </div>
  );
};

export default TrTrainTimeInfo;
