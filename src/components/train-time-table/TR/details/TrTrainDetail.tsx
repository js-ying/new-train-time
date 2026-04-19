import useLang from "@/hooks/useLang";
import { JsyTrTimetable } from "@/models/jsy-tr-info";

import { getNameLangKey } from "@/utils/LocaleUtils";
import Chip from "@mui/material/Chip";
import { useTranslation } from "next-i18next";
import { FC } from "react";
import { trTrainServiceList } from "../TrTrainServices";

interface TrTrainDetailProps {
  data: JsyTrTimetable;
}

const TrTrainDetail: FC<TrTrainDetailProps> = ({ data }) => {
  const { t, i18n } = useTranslation();
  const { isTw } = useLang();
  const langKey = getNameLangKey(i18n.language);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Chip label={t("station")} size="small" color="primary" />
        <div className="flex items-center">
          {data.stopTimes[0].stationName[langKey]} -{" "}
          {data.stopTimes[data.stopTimes.length - 1].stationName[langKey]}
        </div>
      </div>
      <div className="flex gap-2">
        <Chip label={t("timeRange")} size="small" color="primary" />
        <div className="flex items-center">
          {data.trainDate} {data.stopTimes[0].departureTime} -{" "}
          {data.stopTimes[data.stopTimes.length - 1].arrivalTime}
        </div>
      </div>
      <div className="flex gap-2">
        <Chip label={t("ticketFare")} size="small" color="primary" />
        <div className="items-center">
          <span>
            {t("adultPrice")} NTD{" "}
            {data.fareList.length > 0 && data.fareList[0].price}
          </span>
          {t("comma")}
          <span>
            {t("discountedPrice")} NTD{" "}
            {data.fareList.length > 0 &&
              (data.fareList[0].price / 2).toFixed(0)}
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <Chip label={t("trainServices")} size="small" color="primary" />
        <div>
          {trTrainServiceList
            .filter((service) => data.trainInfo[service.flagName] === 1)
            .map((service) => t(service.i18nKey))
            .join(t("comma"))}

          {trTrainServiceList.filter(
            (service) => data.trainInfo[service.flagName] === 1,
          ).length === 0 && t("none")}
        </div>
      </div>
      {isTw && (
        <div className="flex gap-2">
          <Chip label={t("note")} size="small" color="primary" />
          <div className="flex items-center">{data.trainInfo.note}</div>
        </div>
      )}
    </div>
  );
};

export default TrTrainDetail;
