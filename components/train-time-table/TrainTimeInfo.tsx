import { useTranslation } from "next-i18next";
import { useContext, useState } from "react";
import { SearchAreaContext } from "../../contexts/SearchAreaContext";
import { PageEnum } from "../../enums/Page";
import { TrTrainTimeTable } from "../../types/tr-train-time-table";
import DateUtils from "../../utils/date-utils";
import ThsrTimeInfoLeftArea from "./THSR/ThsrTimeInfoLeftArea";
import ThsrTimeInfoMidArea from "./THSR/ThsrTimeInfoMidArea";
import ThsrTimeInfoRightArea from "./THSR/ThsrTimeInfoRightArea";
import TrTimeInfoLeftArea from "./TR/TrTimeInfoLeftArea";
import TrTimeInfoMidArea from "./TR/TrTimeInfoMidArea";
import TrTimeInfoRightArea from "./TR/TrTimeInfoRightArea";
import TrTrainService from "./TR/TrTrainServices";
import TrTrainTimeDetailDialog from "./TR/TrTrainTimeDetailDialog";

/**
 * 列車時刻資訊
 */
const TrainTimeInfo = ({
  page,
  data,
}: {
  page: PageEnum;
  data: TrTrainTimeTable;
}) => {
  const { i18n } = useTranslation();
  const isTr = page === PageEnum.TR;
  const isThsr = page === PageEnum.THSR;

  const params = useContext(SearchAreaContext);

  const [open, setOpen] = useState(false);
  const openDetail = () => {
    setOpen(true);
  };

  return (
    <div
      className={`${
        DateUtils.isTrainPass(
          params.date,
          DateUtils.getCurrentDate(),
          data.StopTimes[0].DepartureTime,
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
          {isTr && <TrTimeInfoLeftArea data={data} lang={i18n.language} />}
          {isThsr && <ThsrTimeInfoLeftArea />}
        </div>
        <div className="col-span-2 text-center">
          {isTr && <TrTimeInfoMidArea data={data} lang={i18n.language} />}
          {isThsr && <ThsrTimeInfoMidArea />}
        </div>
        <div className="text-center">
          {isTr && <TrTimeInfoRightArea data={data} lang={i18n.language} />}
          {isThsr && <ThsrTimeInfoRightArea />}
        </div>
        <div className="absolute right-1.5 top-1.5 flex gap-1">
          {isTr && <TrTrainService data={data.TrainInfo} />}
        </div>
      </div>
      <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        {data.TrainInfo.Note}
      </div>

      <TrTrainTimeDetailDialog open={open} setOpen={setOpen} data={data} />
    </div>
  );
};

export default TrainTimeInfo;
