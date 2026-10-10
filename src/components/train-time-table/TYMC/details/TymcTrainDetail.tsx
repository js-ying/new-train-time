import {
  DetailInfoList,
  DetailInfoRow,
} from "@/components/common/DetailInfoList";
import useLang from "@/hooks/useLang";
import usePage from "@/hooks/usePage";
import { JsyTymcInfo } from "@/models/jsy-tymc-info";
import { getStationNameById } from "@/utils/StationUtils";
import { isTymcArrivalApprox } from "@/utils/TrainInfoUtils";
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
  const { isSpaceSeparated } = useLang();
  const isArrivalApprox = isTymcArrivalApprox(tymcTimeTable.arrivalSource);

  return (
    <DetailInfoList>
      <DetailInfoRow label={t("station")}>
        {getStationNameById(page, startStationId, i18n.language)} -{" "}
        {getStationNameById(page, endStationId, i18n.language)}
      </DetailInfoRow>
      <DetailInfoRow label={t("date")}>{trainDate}</DetailInfoRow>
      <DetailInfoRow label={t("time")}>
        {tymcTimeTable.departureTime} -{" "}
        {tymcTimeTable.arrivalTime || t("unknown")}{" "}
        {tymcTimeTable.arrivalTime && isArrivalApprox && (
          <span
            className={`text-muted-foreground ${isSpaceSeparated && "pl-1"}`}
          >
            {t("arrivalTimeApproxMsg")}
          </span>
        )}
      </DetailInfoRow>
      <DetailInfoRow label={t("ticketFare")}>
        <TymcFareInfo fares={fareList} />
      </DetailInfoRow>
    </DetailInfoList>
  );
};

export default TymcTrainDetail;
