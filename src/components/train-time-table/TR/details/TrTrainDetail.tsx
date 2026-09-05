import useLang from "@/hooks/useLang";
import { JsyTrTimetable } from "@/models/jsy-tr-info";

import { getNameLangKey } from "@/utils/LocaleUtils";
import Chip from "@mui/material/Chip";
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
  const { t, i18n } = useTranslation();
  const { isTw } = useLang();
  const langKey = getNameLangKey(i18n.language);

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
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Chip label={t("station")} size="small" color="primary" />
        <div className="flex items-center">
          {boardStop.stationName[langKey]}
          {!isSingleStop && <> - {alightStop.stationName[langKey]}</>}
        </div>
      </div>
      <div className="flex gap-2">
        <Chip label={t("timeRange")} size="small" color="primary" />
        <div className="flex items-center">
          {data.trainDate} {boardStop.departureTime}
          {!isSingleStop && <> - {alightStop.arrivalTime}</>}
        </div>
      </div>
      {/* 票價列：fareList 為空時整列略過（轉乘 leg 點開 dialog 不顯示票價） */}
      {data.fareList.length > 0 && (
        <div className="flex gap-2">
          <Chip label={t("ticketFare")} size="small" color="primary" />
          <div className="items-center">
            <span>
              {t("adultPrice")} NTD {data.fareList[0].price}
            </span>
            {t("comma")}
            <span>
              {t("discountedPrice")} NTD{" "}
              {(data.fareList[0].price / 2).toFixed(0)}
            </span>
          </div>
        </div>
      )}
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
