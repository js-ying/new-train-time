import TrTimeInfoLeftArea from "@/components/train-time-table/TR/TrTimeInfoLeftArea";
import TrTimeInfoMidArea from "@/components/train-time-table/TR/TrTimeInfoMidArea";
import TrTimeInfoRightArea from "@/components/train-time-table/TR/TrTimeInfoRightArea";
import TrTrainService from "@/components/train-time-table/TR/TrTrainServices";
import TrTrainTimeDetailDialog from "@/components/train-time-table/TR/TrTrainTimeDetailDialog";
import { SettingContext } from "@/contexts/SettingContext";
import { GaEnum } from "@/enums/GaEnum";
import { useTrTrainDisplay } from "@/hooks/display/useTrTrainDisplay";
import useLang from "@/hooks/useLang";
import { JsyTrTrainTimeTable } from "@/models/tr-train-time-table";
import { gaClickEvent } from "@/utils/GaUtils";
import { useTranslation } from "next-i18next";
import { FC, useContext, useState } from "react";
import { isShowTrOrderBtn } from "./TrOrder";

interface TrTrainTimeInfoProps {
  trTrainTimeTable: JsyTrTrainTimeTable;
}

/**
 * [台鐵] 列車時刻資訊
 */
const TrTrainTimeInfo: FC<TrTrainTimeInfoProps> = ({ trTrainTimeTable }) => {
  const [open, setOpen] = useState(false);
  const { isTw } = useLang();
  const { t } = useTranslation();
  const { showTrTrainNote } = useContext(SettingContext);

  const { isPassed, isOnlyTicket, note, timeRange, durationText } =
    useTrTrainDisplay(trTrainTimeTable);

  const openDetail = () => {
    gaClickEvent(GaEnum.TR_TRAIN_INFO);
    setOpen(true);
  };

  return (
    <div className={!open && isPassed ? "opacity-40" : ""}>
      <div
        tabIndex={0}
        role="button"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            openDetail();
          }
        }}
        className={`custom-cursor-pointer relative grid grid-cols-4 items-center
          justify-between rounded-md border border-solid border-zinc-700 p-2
          transition duration-150 ease-out
          dark:border-zinc-200 ${
            isShowTrOrderBtn(trTrainTimeTable)
              ? "min-h-[108px] md:min-h-fit"
              : ""
          }`}
        onClick={openDetail}
      >
        <div className="text-center">
          <TrTimeInfoLeftArea data={trTrainTimeTable} />
        </div>
        <div className="col-span-2 text-center">
          <TrTimeInfoMidArea
            timeRange={timeRange}
            durationText={durationText}
            delayInfo={trTrainTimeTable.delayInfo}
          />
        </div>
        <div className="text-center">
          <TrTimeInfoRightArea data={trTrainTimeTable} />
        </div>
        <div className="absolute right-1.5 top-1.5 flex gap-1">
          <TrTrainService data={trTrainTimeTable.TrainInfo} />
        </div>
      </div>

      {isOnlyTicket && (
        <div className="mt-1 text-xs text-silverLakeBlue-500 dark:text-gamboge-500">
          {t("eTicketAlertMsg")}
        </div>
      )}

      {isTw && showTrTrainNote && note && (
        <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          {note}
        </div>
      )}

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
