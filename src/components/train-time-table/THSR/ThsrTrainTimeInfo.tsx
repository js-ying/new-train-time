import { SettingContext } from "@/contexts/SettingContext";
import { GaEnum } from "@/enums/GaEnum";
import { useThsrTrainDisplay } from "@/hooks/display/useThsrTrainDisplay";
import {
  JsyTimeTable,
  ThsrDailyFreeSeatingCar,
  ThsrOdFare,
  ThsrTdxGeneralTimeTable,
} from "@/models/jsy-thsr-info";
import { gaClickEvent } from "@/utils/GaUtils";
import { useTranslation } from "next-i18next";
import { FC, useContext, useState } from "react";
import ThsrFreeSeat from "./ThsrFreeSeat";
import ThsrServiceDay from "./ThsrServiceDay";
import ThsrTimeInfoLeftArea from "./ThsrTimeInfoLeftArea";
import ThsrTimeInfoMidArea from "./ThsrTimeInfoMidArea";
import ThsrTimeInfoRightArea from "./ThsrTimeInfoRightArea";
import ThsrTrainTimeDetailDialog from "./ThsrTrainTimeDetailDialog";

interface ThsrTrainTimeInfoProps {
  thsrTrainTimeTable: JsyTimeTable;
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
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { showThsrTrainNote } = useContext(SettingContext);

  const { isPassed, trainNo, timeRange, durationText } =
    useThsrTrainDisplay(thsrTrainTimeTable);

  const openDetail = () => {
    gaClickEvent(GaEnum.THSR_TRAIN_INFO);
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
          <ThsrTimeInfoMidArea
            timeRange={timeRange}
            durationText={durationText}
          />
        </div>
        <div className="text-center">
          <ThsrTimeInfoRightArea data={thsrTrainTimeTable} />
        </div>
      </div>
      <div className="mt-1.5 flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
        <span>{t("freeSeating")}</span>
        <ThsrFreeSeat
          trainNo={trainNo}
          freeSeatData={thsrFreeSeatingCars}
          showLabel={true}
        />
        {showThsrTrainNote && (
          <>
            <span className="mx-1">|</span>
            <ThsrServiceDay
              trainNo={trainNo}
              generalTimeTable={thsrTdxGeneralTimeTable}
            />
          </>
        )}
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
