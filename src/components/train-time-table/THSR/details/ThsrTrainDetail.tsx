import {
  JsyThsrInfo,
  ThsrDailyTimetable,
  ThsrOdFare,
  ThsrTdxGeneralTimeTable,
} from "@/models/jsy-thsr-info";
import { getTdxLang } from "@/utils/LocaleUtils";
import Chip from "@mui/material/Chip";
import { useTranslation } from "next-i18next";
import { FC } from "react";
import ThsrFreeSeat from "../ThsrFreeSeat";
import ThsrPriceInfo from "../ThsrPriceInfo";
import ThsrServiceDay from "../ThsrServiceDay";

interface ThsrTrainDetailProps {
  thsrTrainTimeTable: ThsrDailyTimetable;
  thsrFreeSeatingCars: JsyThsrInfo["freeSeatingCars"];
  thsrOdFare: ThsrOdFare[];
  thsrTdxGeneralTimeTable: ThsrTdxGeneralTimeTable[];
}

const ThsrTrainDetail: FC<ThsrTrainDetailProps> = ({
  thsrTrainTimeTable,
  thsrFreeSeatingCars,
  thsrOdFare,
  thsrTdxGeneralTimeTable,
}) => {
  const { t, i18n } = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Chip label={t("station")} size="small" color="primary" />
        <div className="flex items-center">
          {
            thsrTrainTimeTable.OriginStopTime.StationName[
              getTdxLang(i18n.language)
            ]
          }{" "}
          -{" "}
          {
            thsrTrainTimeTable.DestinationStopTime.StationName[
              getTdxLang(i18n.language)
            ]
          }
        </div>
      </div>
      <div className="flex gap-2">
        <Chip label={t("timeRange")} size="small" color="primary" />
        <div className="flex items-center">
          {thsrTrainTimeTable.TrainDate}{" "}
          {thsrTrainTimeTable.OriginStopTime.DepartureTime} -{" "}
          {thsrTrainTimeTable.DestinationStopTime.ArrivalTime}
        </div>
      </div>
      <div className="flex gap-2">
        <Chip label={t("ticketFare")} size="small" color="primary" />
        <div className="flex items-center">
          <ThsrPriceInfo dataList={thsrOdFare} showLabel={false} />
        </div>
      </div>
      <div className="flex gap-2">
        <Chip label={t("freeSeating")} size="small" color="primary" />
        <div className="flex items-center">
          <ThsrFreeSeat
            trainNo={thsrTrainTimeTable.DailyTrainInfo.TrainNo}
            freeSeatData={thsrFreeSeatingCars}
            showLabel={false}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Chip label={t("note")} size="small" color="primary" />
        <div className="flex items-center">
          <ThsrServiceDay
            trainNo={thsrTrainTimeTable.DailyTrainInfo.TrainNo}
            generalTimeTable={thsrTdxGeneralTimeTable}
          />
        </div>
      </div>
    </div>
  );
};

export default ThsrTrainDetail;
