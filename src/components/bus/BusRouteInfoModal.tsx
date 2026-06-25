import CommonDialog from "@/components/common/CommonDialog";
import NoTrainData from "@/components/train-time-table/NoTrainData";
import { ApiError } from "@/models/problem-details";
import {
  JsyBusHeadway,
  JsyBusRouteInfo,
  JsyBusScheduleGroup,
} from "@/models/jsy-bus-info";
import { useTranslation } from "next-i18next";
import { FC } from "react";

interface BusRouteInfoModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  /** modal 標題（路線名）；info 未到位前先用已選路線名 */
  title: string;
  info: JsyBusRouteInfo | null;
  isLoading: boolean;
  error: ApiError | null;
}

/** 詳細資訊單列：左標籤右內容。 */
const InfoRow: FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div className="flex gap-2 text-sm">
    <span className="shrink-0 text-zinc-500 dark:text-zinc-400">{label}</span>
    <span className="text-left font-medium">{children}</span>
  </div>
);

/** 一組（方向/子線）的定期時刻表。 */
const ScheduleBlock: FC<{ group: JsyBusScheduleGroup }> = ({ group }) => {
  const { t } = useTranslation();

  const headwayText = (h: JsyBusHeadway): string => {
    const mins =
      h.minHeadwayMins != null &&
      h.maxHeadwayMins != null &&
      h.minHeadwayMins !== h.maxHeadwayMins
        ? `${h.minHeadwayMins}-${h.maxHeadwayMins}`
        : `${h.minHeadwayMins ?? h.maxHeadwayMins ?? "?"}`;
    return t("busHeadwayRange", { start: h.startTime, end: h.endTime, mins });
  };

  const renderTimes = (times: string[], headways?: JsyBusHeadway[]) => {
    if (times.length > 0) {
      return (
        <div className="flex flex-wrap gap-1">
          {times.map((tm) => (
            <span
              key={tm}
              className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs tabular-nums dark:bg-zinc-700"
            >
              {tm}
            </span>
          ))}
        </div>
      );
    }
    if (headways && headways.length > 0) {
      return (
        <div className="flex flex-col gap-0.5 text-xs">
          {headways.map((h, i) => (
            <span key={i}>{headwayText(h)}</span>
          ))}
        </div>
      );
    }
    return <span className="text-xs text-zinc-400">{t("none")}</span>;
  };

  return (
    <div className="rounded-md border border-solid border-foreground p-2">
      <div className="mb-1 text-sm font-bold">{group.subRouteName}</div>
      <div className="flex flex-col gap-1.5">
        <div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            {t("busInfoWeekday")}
          </div>
          {renderTimes(group.weekdayTimes, group.weekdayHeadways)}
        </div>
        <div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            {t("busInfoHoliday")}
          </div>
          {renderTimes(group.holidayTimes, group.holidayHeadways)}
        </div>
      </div>
    </div>
  );
};

/** [公車] 路線詳細資訊 modal：業者/票價/分段/官方路線圖 + 平日/假日定期時刻表。 */
const BusRouteInfoModal: FC<BusRouteInfoModalProps> = ({
  open,
  setOpen,
  title,
  info,
  isLoading,
  error,
}) => {
  const { t } = useTranslation();

  return (
    <CommonDialog open={open} setOpen={setOpen} title={title} size="lg">
      {isLoading && !info ? (
        <div className="py-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
          {t("busInfoLoading")}
        </div>
      ) : error && !info ? (
        <NoTrainData apiError={error} />
      ) : info ? (
        <div className="flex flex-col gap-3 text-left">
          {(info.departureStop || info.destinationStop) && (
            <InfoRow label={t("busInfoEndpoints")}>
              {info.departureStop} - {info.destinationStop}
            </InfoRow>
          )}
          {info.operators.length > 0 && (
            <InfoRow label={t("busInfoOperator")}>
              {info.operators.join(t("comma"))}
            </InfoRow>
          )}
          {info.ticketPrice && (
            <InfoRow label={t("busInfoTicketPrice")}>{info.ticketPrice}</InfoRow>
          )}
          {info.fareBufferZone && (
            <InfoRow label={t("busInfoFareBufferZone")}>
              {info.fareBufferZone}
            </InfoRow>
          )}
          {info.routeMapImageUrl && (
            <a
              href={info.routeMapImageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-silverLakeBlue-500 underline dark:text-gamboge-500"
            >
              {t("busViewRouteMap")}
            </a>
          )}

          <div>
            <div className="mb-1.5 text-sm font-bold">
              {t("busInfoSchedule")}
            </div>
            {info.schedules.length > 0 ? (
              <div className="flex flex-col gap-2">
                {info.schedules.map((g, i) => (
                  <ScheduleBlock key={`${g.direction}-${g.subRouteName}-${i}`} group={g} />
                ))}
              </div>
            ) : (
              <div className="text-xs text-zinc-400">
                {t("busInfoNoSchedule")}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </CommonDialog>
  );
};

export default BusRouteInfoModal;
