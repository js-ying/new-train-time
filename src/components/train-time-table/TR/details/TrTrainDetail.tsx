import useStationName from "@/hooks/useStationName";
import { PageEnum } from "@/enums/PageEnum";
import {
  DetailInfoList,
  DetailInfoRow,
} from "@/components/common/DetailInfoList";
import useLang from "@/hooks/useLang";
import { JsyTrTimetable } from "@/models/jsy-tr-info";

import { useTranslation } from "next-i18next";
import { FC, useMemo } from "react";
import { trTrainServiceList } from "../TrTrainServices";

interface TrTrainDetailProps {
  data: JsyTrTimetable;
  /**
   * 使用者查詢的站 stationId（車站 / 時程兩列以此為準）。
   * 不傳 → 頭尾兩站（OD 直達：stopTimes 已裁到查詢起迄）。
   * 單站時刻表傳查詢站（單站 → 只顯示站名與該站發車時間）；轉乘 leg 傳該段上/下車站。
   */
  queryStationIds?: string[];
}

const TrTrainDetail: FC<TrTrainDetailProps> = ({ data, queryStationIds }) => {
  const { t } = useTranslation();
  const { isZh } = useLang();
  const stationName = useStationName(PageEnum.TR);

  // 查詢區間的停靠；未指定（或指定站不在停靠表）時 fallback 頭尾
  const querySegment = useMemo(() => {
    const stops = data.stopTimes;
    const fallback =
      stops.length > 0 ? [stops[0], stops[stops.length - 1]] : [];
    if (!queryStationIds?.length) return fallback;
    const idSet = new Set(queryStationIds);
    const matched = stops.filter((stop) => idSet.has(stop.stationId));
    return matched.length > 0 ? matched : fallback;
  }, [data.stopTimes, queryStationIds]);

  const boardStop = querySegment[0];
  const alightStop = querySegment[querySegment.length - 1];
  // 單站查詢（起迄為同一站）只顯示該站發車時間，不顯示區間
  const isSingleStop = boardStop === alightStop;

  return (
    <DetailInfoList>
      <DetailInfoRow label={t("station")}>
        {stationName(boardStop.stationId, boardStop.stationName)}
        {!isSingleStop && (
          <> - {stationName(alightStop.stationId, alightStop.stationName)}</>
        )}
      </DetailInfoRow>
      <DetailInfoRow label={t("timeRange")}>
        {data.trainDate} {boardStop.departureTime}
        {!isSingleStop && <> - {alightStop.arrivalTime}</>}
      </DetailInfoRow>
      {/* 票價列：fareList 為空時整列略過（轉乘 leg 點開 dialog 不顯示票價） */}
      {data.fareList.length > 0 && (
        <DetailInfoRow label={t("ticketFare")}>
          <span>
            {t("adultPrice")}{" "}
            {t("fareAmount", { price: data.fareList[0].price })}
          </span>
          {/* 無半票資料時不顯示 */}
          {data.fareList[0].discountedPrice !== undefined && (
            <>
              {t("comma")}
              <span>
                {t("discountedPrice")}{" "}
                {t("fareAmount", {
                  price: data.fareList[0].discountedPrice,
                })}
              </span>
            </>
          )}
        </DetailInfoRow>
      )}
      <DetailInfoRow label={t("trainServices")}>
        {trTrainServiceList
          .filter((service) => data.trainInfo[service.flagName] === 1)
          .map((service) => t(service.i18nKey))
          .join(t("comma"))}

        {trTrainServiceList.filter(
          (service) => data.trainInfo[service.flagName] === 1,
        ).length === 0 && t("none")}
      </DetailInfoRow>
      {isZh && (
        <DetailInfoRow label={t("note")}>{data.trainInfo.note}</DetailInfoRow>
      )}
    </DetailInfoList>
  );
};

export default TrTrainDetail;
