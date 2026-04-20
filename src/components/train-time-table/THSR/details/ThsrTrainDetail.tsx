import {
  JsyThsrGeneralTimetable,
  JsyThsrInfo,
  JsyThsrOdFare,
  JsyThsrTimetable,
} from "@/models/jsy-thsr-info";
import { getNameLangKey } from "@/utils/LocaleUtils";
import Chip from "@mui/material/Chip";
import { useTranslation } from "next-i18next";
import { FC } from "react";
import ThsrFreeSeat from "../ThsrFreeSeat";
import ThsrPriceInfo from "../ThsrPriceInfo";
import ThsrServiceDay from "../ThsrServiceDay";

interface ThsrTrainDetailProps {
  thsrTrainTimeTable: JsyThsrTimetable;
  thsrFreeSeatingCars: JsyThsrInfo["freeSeatingCars"];
  thsrOdFare: JsyThsrOdFare[];
  thsrGeneralTimeTable: JsyThsrGeneralTimetable[];
}

const ThsrTrainDetail: FC<ThsrTrainDetailProps> = ({
  thsrTrainTimeTable,
  thsrFreeSeatingCars,
  thsrOdFare,
  thsrGeneralTimeTable,
}) => {
  const { t, i18n } = useTranslation();
  const langKey = getNameLangKey(i18n.language);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Chip label={t("station")} size="small" color="primary" />
        <div className="flex items-center">
          {thsrTrainTimeTable.originStopTime.stationName[langKey]} -{" "}
          {thsrTrainTimeTable.destinationStopTime.stationName[langKey]}
        </div>
      </div>
      <div className="flex gap-2">
        <Chip label={t("timeRange")} size="small" color="primary" />
        <div className="flex items-center">
          {thsrTrainTimeTable.trainDate}{" "}
          {thsrTrainTimeTable.originStopTime.departureTime} -{" "}
          {thsrTrainTimeTable.destinationStopTime.arrivalTime}
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
            trainNo={thsrTrainTimeTable.trainInfo.trainNo}
            freeSeatData={thsrFreeSeatingCars}
            showLabel={false}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Chip label={t("note")} size="small" color="primary" />
        <div className="flex items-center">
          <ThsrServiceDay
            trainNo={thsrTrainTimeTable.trainInfo.trainNo}
            generalTimeTable={thsrGeneralTimeTable}
          />
        </div>
      </div>
    </div>
  );
};

export default ThsrTrainDetail;
