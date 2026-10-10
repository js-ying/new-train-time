import useStationName from "@/hooks/useStationName";
import { PageEnum } from "@/enums/PageEnum";
import {
  DetailInfoList,
  DetailInfoRow,
} from "@/components/common/DetailInfoList";
import {
  JsyThsrInfo,
  JsyThsrOdFare,
  JsyThsrTimetable,
} from "@/models/jsy-thsr-info";
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
  const { t } = useTranslation();
  const stationName = useStationName(PageEnum.THSR);

  return (
    <DetailInfoList>
      <DetailInfoRow label={t("station")}>
        {stationName(
          thsrTrainTimeTable.originStopTime.stationId,
          thsrTrainTimeTable.originStopTime.stationName,
        )}{" "}
        -{" "}
        {stationName(
          thsrTrainTimeTable.destinationStopTime.stationId,
          thsrTrainTimeTable.destinationStopTime.stationName,
        )}
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
