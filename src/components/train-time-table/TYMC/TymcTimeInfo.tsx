import { GaEnum } from "@/enums/GaEnum";
import { JsyTymcInfo } from "@/models/jsy-tymc-info";
import DateUtils from "@/utils/DateUtils";
import { gaClickEvent } from "@/utils/GaUtils";
import { isTrainPass } from "@/utils/TrainInfoUtils";
import { useTranslation } from "next-i18next";
import { FC, useState } from "react";
import TymcTrainTimeDetailDialog from "./TymcTrainTimeDetailDialog";

interface TymcTimeInfoProps {
  tymcTimeTable: JsyTymcInfo["timeTables"][0];
  fareList: JsyTymcInfo["fareList"];
  trainDate: string;
  startStationId: string;
  endStationId: string;
}

/**
 * [桃園捷運] 列車時刻資訊
 */
const TymcTimeInfo: FC<TymcTimeInfoProps> = ({
  tymcTimeTable,
  fareList,
  trainDate,
  startStationId,
  endStationId,
}) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const openDetail = () => {
    gaClickEvent(GaEnum.THSR_TRAIN_INFO);
    setOpen(true);
  };

  return (
    <div
      className={`${
        !open &&
        isTrainPass(
          trainDate,
          DateUtils.getCurrentDate(),
          tymcTimeTable?.DepartureTime,
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
        {/* Left */}
        <div className="text-center text-sm">
          {String(tymcTimeTable.TrainType) === "1" ? (
            <span
              className={`rounded px-1 py-0.5
              ${"bg-sky-500 text-white dark:bg-sky-500/80"}`}
            >
              {t("normalArrive")}
            </span>
          ) : (
            <span
              className={`rounded px-1 py-0.5
              ${"bg-rose-500 text-white dark:bg-rose-500/80"}`}
            >
              {t("directlyArrive")}
            </span>
          )}
        </div>
        {/* Mid */}
        <div className="col-span-2 text-center">
          <div className="flex items-center justify-center gap-1.5">
            <span className="whitespace-nowrap">
              {tymcTimeTable.DepartureTime} - {tymcTimeTable.jsyArrivalTime}
            </span>
            <span className="whitespace-nowrap text-sm">± 3 {t("minute")}</span>
          </div>
          <div className="whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-400">
            {t("about")}{" "}
            {t("trainInfoTimeDiff", {
              hour: parseInt(tymcTimeTable.jsyRunTime.split(":")[0], 10),
              min: parseInt(tymcTimeTable.jsyRunTime.split(":")[1], 10),
            })}
          </div>
        </div>
        {/* Right */}
        <div className="text-center text-xs">
          NTD{" "}
          {
            fareList.find(
              (fare) => fare.TicketType === 1 && fare.FareClass === 1,
            ).Price
          }
        </div>
      </div>

      <TymcTrainTimeDetailDialog
        open={open}
        setOpen={setOpen}
        tymcTimeTable={tymcTimeTable}
        fareList={fareList}
        trainDate={trainDate}
        startStationId={startStationId}
        endStationId={endStationId}
      />
    </div>
  );
};

export default TymcTimeInfo;
