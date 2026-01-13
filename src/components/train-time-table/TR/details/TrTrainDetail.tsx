import useLang from "@/hooks/useLang";
import { JsyTrTrainTimeTable } from "@/models/tr-train-time-table";
import { getTdxLang } from "@/utils/LocaleUtils";
import Chip from "@mui/material/Chip";
import { useTranslation } from "next-i18next";
import { FC } from "react";
import { trTrainServiceList } from "../TrTrainServices";

interface TrTrainDetailProps {
  data: JsyTrTrainTimeTable;
}

const TrTrainDetail: FC<TrTrainDetailProps> = ({ data }) => {
  const { t, i18n } = useTranslation();
  const { isTw } = useLang();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Chip label={t("station")} size="small" color="primary" />
        <div className="flex items-center">
          {data.StopTimes[0].StationName[getTdxLang(i18n.language)]} -{" "}
          {
            data.StopTimes[data.StopTimes.length - 1].StationName[
              getTdxLang(i18n.language)
            ]
          }
        </div>
      </div>
      <div className="flex gap-2">
        <Chip label={t("timeRange")} size="small" color="primary" />
        <div className="flex items-center">
          {data.trainDate} {data.StopTimes[0].DepartureTime} -{" "}
          {data.StopTimes[data.StopTimes.length - 1].ArrivalTime}
        </div>
      </div>
      <div className="flex gap-2">
        <Chip label={t("ticketFare")} size="small" color="primary" />
        <div className="items-center">
          <span>
            {t("adultPrice")} NTD{" "}
            {data.fareList.length > 0 && data.fareList[0].Price}
          </span>
          {t("comma")}
          <span>
            {t("discountedPrice")} NTD{" "}
            {data.fareList.length > 0 &&
              (data.fareList[0].Price / 2).toFixed(0)}
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <Chip label={t("trainServices")} size="small" color="primary" />
        <div>
          {trTrainServiceList
            .filter((service) => data.TrainInfo[service.flagName] === 1)
            .map((service) => t(`trainService${service.flagName}`))
            .join(t("comma"))}

          {trTrainServiceList.filter(
            (service) => data.TrainInfo[service.flagName] === 1,
          ).length === 0 && t("none")}
        </div>
      </div>
      {isTw && (
        <div className="flex gap-2">
          <Chip label={t("note")} size="small" color="primary" />
          <div className="flex items-center">{data.TrainInfo.Note}</div>
        </div>
      )}
    </div>
  );
};

export default TrTrainDetail;
