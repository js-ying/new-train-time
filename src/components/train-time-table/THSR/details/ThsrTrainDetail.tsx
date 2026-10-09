import {
  DetailInfoList,
  DetailInfoRow,
} from "@/components/common/DetailInfoList";
import {
  JsyThsrInfo,
  JsyThsrOdFare,
  JsyThsrTimetable,
} from "@/models/jsy-thsr-info";
import { getNameLangKey } from "@/utils/LocaleUtils";
import { useTranslation } from "next-i18next";
import { FC } from "react";
import ThsrFreeSeat from "../ThsrFreeSeat";
import ThsrPriceInfo from "../ThsrPriceInfo";
import ThsrServiceDay from "../ThsrServiceDay";

interface ThsrTrainDetailProps {
  thsrTrainTimeTable: JsyThsrTimetable;
  thsrFreeSeatingCars: JsyThsrInfo["freeSeatingCars"];
  thsrOdFare: JsyThsrOdFare[];
}

const ThsrTrainDetail: FC<ThsrTrainDetailProps> = ({
  thsrTrainTimeTable,
  thsrFreeSeatingCars,
  thsrOdFare,
}) => {
  const { t, i18n } = useTranslation();
  const langKey = getNameLangKey(i18n.language);

  return (
    <DetailInfoList>
      <DetailInfoRow label={t("station")}>
        {thsrTrainTimeTable.originStopTime.stationName[langKey]} -{" "}
        {thsrTrainTimeTable.destinationStopTime.stationName[langKey]}
      </DetailInfoRow>
      <DetailInfoRow label={t("timeRange")}>
        {thsrTrainTimeTable.trainDate}{" "}
        {thsrTrainTimeTable.originStopTime.departureTime} -{" "}
        {thsrTrainTimeTable.destinationStopTime.arrivalTime}
      </DetailInfoRow>
      <DetailInfoRow label={t("ticketFare")}>
        <ThsrPriceInfo dataList={thsrOdFare} showLabel={false} />
      </DetailInfoRow>
      <DetailInfoRow label={t("freeSeating")}>
        <ThsrFreeSeat
          trainNo={thsrTrainTimeTable.trainInfo.trainNo}
          freeSeatData={thsrFreeSeatingCars}
          showLabel={false}
        />
      </DetailInfoRow>
      {thsrTrainTimeTable.serviceDay && (
        <DetailInfoRow label={t("note")}>
          <ThsrServiceDay serviceDay={thsrTrainTimeTable.serviceDay} />
        </DetailInfoRow>
      )}
    </DetailInfoList>
  );
};

export default ThsrTrainDetail;
