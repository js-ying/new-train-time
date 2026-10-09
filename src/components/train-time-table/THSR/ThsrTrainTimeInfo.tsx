import { SettingContext } from "@/contexts/SettingContext";
import { GaEnum } from "@/enums/GaEnum";
import { useThsrTrainDisplay } from "@/hooks/display/useThsrTrainDisplay";
import {
  JsyThsrFreeSeatingCar,
  JsyThsrOdFare,
  JsyThsrTimetable,
} from "@/models/jsy-thsr-info";
import { gaClickEvent } from "@/utils/GaUtils";
import { useTranslation } from "next-i18next";
import { FC, ReactNode, useContext, useState } from "react";
import ThsrFreeSeat from "./ThsrFreeSeat";
import ThsrServiceDay from "./ThsrServiceDay";
import ThsrTimeInfoLeftArea from "./ThsrTimeInfoLeftArea";
import ThsrTimeInfoMidArea from "./ThsrTimeInfoMidArea";
import ThsrTimeInfoRightArea from "./ThsrTimeInfoRightArea";
import ThsrTrainTimeDetailDialog from "./ThsrTrainTimeDetailDialog";

interface ThsrTrainTimeInfoProps {
  thsrTrainTimeTable: JsyThsrTimetable;
  /** 查詢日，用來標示隔日午夜後上車的班次 */
  queryDate: string;
  thsrFreeSeatingCars: JsyThsrFreeSeatingCar[];
  thsrOdFare: JsyThsrOdFare[];
  isGeneralTimetable: boolean;
}

/** 卡片下方資訊組：整組換行，前置分隔線 */
const FooterGroup: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="flex items-center">
    <span className="w-5 shrink-0 text-center">|</span>
    <div className="flex items-center gap-1">{children}</div>
  </div>
);

/**
 * [高鐵] 列車時刻資訊
 */
const ThsrTrainTimeInfo: FC<ThsrTrainTimeInfoProps> = ({
  thsrTrainTimeTable,
  queryDate,
  thsrFreeSeatingCars,
  thsrOdFare,
  isGeneralTimetable,
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { showThsrTrainNote } = useContext(SettingContext);

  const { isPassed, trainNo, timeRange, durationText, isNextDay } =
    useThsrTrainDisplay(thsrTrainTimeTable, queryDate);

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
          justify-between rounded-md border border-solid border-foreground p-2
          transition duration-150 ease-out"
        onClick={openDetail}
      >
        <div className="text-center">
          <ThsrTimeInfoLeftArea data={thsrTrainTimeTable} />
        </div>
        <div className="col-span-2 text-center">
          <ThsrTimeInfoMidArea
            timeRange={timeRange}
            durationText={durationText}
            isNextDay={isNextDay}
          />
        </div>
        <div className="text-center">
          <ThsrTimeInfoRightArea
            data={thsrTrainTimeTable}
            isGeneralTimetable={isGeneralTimetable}
          />
        </div>
      </div>
      {/* 每組前置分隔線，-ml-5 + overflow-hidden 讓位於行首（含換行後）的分隔線被裁掉 */}
      <div className="mt-1.5 overflow-hidden text-xs text-muted-foreground">
        <div className="-ml-5 flex flex-wrap items-center gap-y-0.5">
          <FooterGroup>
            <span>{t("freeSeating")}</span>
            <ThsrFreeSeat
              trainNo={trainNo}
              freeSeatData={thsrFreeSeatingCars}
              showLabel={true}
            />
          </FooterGroup>
          {showThsrTrainNote && thsrTrainTimeTable.serviceDay && (
            <FooterGroup>
              <ThsrServiceDay serviceDay={thsrTrainTimeTable.serviceDay} />
            </FooterGroup>
          )}
        </div>
      </div>

      {thsrTrainTimeTable && (
        <ThsrTrainTimeDetailDialog
          open={open}
          setOpen={setOpen}
          thsrTrainTimeTable={thsrTrainTimeTable}
          thsrFreeSeatingCars={thsrFreeSeatingCars}
          thsrOdFare={thsrOdFare}
          isGeneralTimetable={isGeneralTimetable}
        />
      )}
    </div>
  );
};

export default ThsrTrainTimeInfo;
