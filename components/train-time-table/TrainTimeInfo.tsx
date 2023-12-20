import { useTranslation } from "next-i18next";
import { PageEnum } from "../../enums/Page";
import { TrTrainTimeTable } from "../../types/tr-train-time-table";
import ThsrTimeInfoLeftArea from "./THSR/ThsrTimeInfoLeftArea";
import ThsrTimeInfoMidArea from "./THSR/ThsrTimeInfoMidArea";
import ThsrTimeInfoRightArea from "./THSR/ThsrTimeInfoRightArea";
import TrTimeInfoLeftArea from "./TR/TrTimeInfoLeftArea";
import TrTimeInfoMidArea from "./TR/TrTimeInfoMidArea";
import TrTimeInfoRightArea from "./TR/TrTimeInfoRightArea";
import TrTrainService from "./TR/TrTrainServices";

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

  return (
    <>
      <div
        className="relative grid cursor-pointer grid-cols-4 items-center
          justify-between rounded-md border border-solid border-zinc-700 p-2
          transition duration-150 ease-out dark:border-zinc-200"
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
    </>
  );
};

export default TrainTimeInfo;
