import useLang from "@/hooks/useLang";
import usePage from "@/hooks/usePage";
import { JsyTymcInfo } from "@/models/jsy-tymc-info";
import { getStationNameById } from "@/utils/StationUtils";
import Chip from "@mui/material/Chip";
import { useTranslation } from "next-i18next";
import { FC } from "react";
import TymcFareInfo from "../TymcFareInfo";

interface TymcTrainDetailProps {
  tymcTimeTable: JsyTymcInfo["timeTables"][0];
  fareList: JsyTymcInfo["fareList"];
  trainDate: string;
  startStationId: string;
  endStationId: string;
}

const TymcTrainDetail: FC<TymcTrainDetailProps> = ({
  tymcTimeTable,
  trainDate,
  startStationId,
  endStationId,
  fareList,
}) => {
  const { page } = usePage();
  const { t, i18n } = useTranslation();
  const { isTw } = useLang();

  return (
    <div className="flex flex-col gap-2">
      {/* 車站 */}
      <div className="flex gap-2">
        <Chip label={t("station")} size="small" color="primary" />
        <div className="flex items-center text-left">
          {getStationNameById(page, startStationId, i18n.language)} -{" "}
          {getStationNameById(page, endStationId, i18n.language)}
        </div>
      </div>
      {/* 日期 */}
      <div className="flex gap-2">
        <Chip label={t("date")} size="small" color="primary" />
        <div className="flex items-center text-left">{trainDate}</div>
      </div>
      {/* 時間 */}
      <div className="flex gap-2">
        <Chip label={t("time")} size="small" color="primary" />
        <div className="text-left">
          {tymcTimeTable.DepartureTime} - {tymcTimeTable.jsyArrivalTime}{" "}
          <span className="whitespace-nowrap">± 3 {t("minute")}</span>
          <span
            className={`text-zinc-500 dark:text-zinc-400 ${!isTw && "pl-1"}`}
          >
            {t("arrivalTimeAccuracyMsg")}
          </span>
        </div>
      </div>
      {/* 票價 */}
      <div className="flex gap-2">
        <Chip label={t("ticketFare")} size="small" color="primary" />
        <div className="text-left">
          <TymcFareInfo fares={fareList} />
        </div>
      </div>
    </div>
  );
};

export default TymcTrainDetail;
