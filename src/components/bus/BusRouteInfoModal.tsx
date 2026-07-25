import Loading from "@/components/common/Loading";
import CaptureIcon from "@/components/icons/CaptureIcon";
import NoTrainData from "@/components/train-time-table/NoTrainData";
import { GaEnum } from "@/enums/GaEnum";
import { useCaptureShare } from "@/hooks/useCaptureShare";
import {
  JsyBusFirstLastBus,
  JsyBusHeadway,
  JsyBusRoute,
  JsyBusRouteInfo,
  JsyBusScheduleGroup,
} from "@/models/jsy-bus-info";
import { ApiError } from "@/models/problem-details";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/common/SwipeableModal";
import { Button } from "@heroui/react";
import Chip from "@mui/material/Chip";
import { useTranslation } from "next-i18next";
import { FC, Fragment, ReactNode } from "react";

/** 外部連結 icon（方框 + 往右上脫出箭頭）；「查看路線圖」開到外部官方頁。 */
const ExternalLinkIcon: FC = () => (
  <svg
    viewBox="0 0 24 24"
    className="size-4"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M19 13.5V18A1.5 1.5 0 0 1 17.5 19.5h-11A1.5 1.5 0 0 1 5 18V7A1.5 1.5 0 0 1 6.5 5.5H11" />
    <path d="M14.5 4.5H19.5V9.5" />
    <path d="M19.5 4.5L11.5 12.5" />
  </svg>
);

interface BusRouteInfoModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  /** 已選路線（標題、分類來源）；info 為非同步取得的詳細資料 */
  route: JsyBusRoute;
  info: JsyBusRouteInfo | null;
  isLoading: boolean;
  error: ApiError | null;
}

/** 詳細資訊單列：左主題色 chip 標籤、右內容（沿用 TR detail 樣式）。 */
const ChipRow: FC<{ label: string; children: ReactNode }> = ({
  label,
  children,
}) => (
  <div className="flex gap-2 text-base">
    <Chip label={label} size="small" color="primary" />
    <div className="flex items-center">{children}</div>
  </div>
);

/** 平日/假日雙欄外框（時刻表與班距共用）；suffix 與日別標籤同列（如首末班）。 */
const DayColumns: FC<{
  weekday: ReactNode;
  holiday: ReactNode;
  weekdaySuffix?: ReactNode;
  holidaySuffix?: ReactNode;
}> = ({ weekday, holiday, weekdaySuffix, holidaySuffix }) => (
  <div className="rounded-md border-solid border-foreground">
    <div className="flex flex-col gap-3.5">
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <DayLabel which="busInfoWeekday" />
          {weekdaySuffix}
        </div>
        {weekday}
      </div>
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <DayLabel which="busInfoHoliday" />
          {holidaySuffix}
        </div>
        {holiday}
      </div>
    </div>
  </div>
);

const DayLabel: FC<{ which: "busInfoWeekday" | "busInfoHoliday" }> = ({
  which,
}) => {
  const { t } = useTranslation();
  return (
    <div className="text-sm font-medium text-muted-foreground">
      {t(which)}
    </div>
  );
};

/** 班距去重（跨方向彙整，比照後端 uniqHeadways key），依起始時間排序。 */
const dedupeHeadways = (hws: JsyBusHeadway[]): JsyBusHeadway[] => {
  const seen = new Set<string>();
  const out: JsyBusHeadway[] = [];
  for (const h of hws) {
    const key = `${h.startTime}|${h.endTime}|${h.minHeadwayMins}|${h.maxHeadwayMins}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.push(h);
    }
  }
  return out.sort((a, b) => a.startTime.localeCompare(b.startTime));
};

/**
 * 發車間距：整條路線層級、不分方向（TDX 常只給單向）。平日/假日各列首末班 + 「時段 約 X 分」。
 */
const HeadwaySection: FC<{
  weekday: JsyBusHeadway[];
  holiday: JsyBusHeadway[];
  firstLast?: JsyBusFirstLastBus;
}> = ({ weekday, holiday, firstLast }) => {
  const { t } = useTranslation();

  const minsStr = (h: JsyBusHeadway): string =>
    h.minHeadwayMins != null &&
    h.maxHeadwayMins != null &&
    h.minHeadwayMins !== h.maxHeadwayMins
      ? `${h.minHeadwayMins}-${h.maxHeadwayMins}`
      : `${h.minHeadwayMins ?? h.maxHeadwayMins ?? "?"}`;

  // 首末班：與日別標籤同列、各一個 border 框（border 同文字色），框間靠 gap-2 分隔
  const firstLastBoxes = (fl?: { first: string; last: string }) =>
    fl ? (
      <>
        <span className="rounded border border-solid border-current px-1 py-0.5 text-sm text-muted-foreground">
          {t("busInfoFirstBus", { time: fl.first })}
        </span>
        <span className="rounded border border-solid border-current px-1 py-0.5 text-sm text-muted-foreground">
          {t("busInfoLastBus", { time: fl.last })}
        </span>
      </>
    ) : null;

  const windows = (
    hws: JsyBusHeadway[],
    fl?: { first: string; last: string },
  ) => {
    if (hws.length > 0)
      return (
        <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-sm tabular-nums">
          {hws.map((h, i) => (
            <Fragment key={i}>
              <span>
                {t("busHeadwayTimeRange", {
                  start: h.startTime,
                  end: h.endTime,
                })}
              </span>
              <span>{t("busHeadwayInterval", { mins: minsStr(h) })}</span>
            </Fragment>
          ))}
        </div>
      );
    // 無班距時段：有首末班則已足、不再補；都沒有才顯示「無」
    return fl ? null : (
      <span className="text-sm text-zinc-400">{t("none")}</span>
    );
  };

  return (
    <DayColumns
      weekday={windows(weekday, firstLast?.weekday)}
      holiday={windows(holiday, firstLast?.holiday)}
      weekdaySuffix={firstLastBoxes(firstLast?.weekday)}
      holidaySuffix={firstLastBoxes(firstLast?.holiday)}
    />
  );
};

/**
 * 定期時刻表單一方向區塊：列出固定發車時刻。多方向才標「往X」；單一方向不標（TDX 常只給單向）。
 */
const TimetableBlock: FC<{
  group: JsyBusScheduleGroup;
  departureStop: string;
  destinationStop: string;
  routeName: string;
  showHeading: boolean;
}> = ({ group, departureStop, destinationStop, routeName, showHeading }) => {
  const { t } = useTranslation();

  // 方向標題：去程(0)→往終點站、返程(1)→往起站、迴圈(2)→「迴圈」；子線名與路線名不同時附註
  const destName = group.direction === 1 ? departureStop : destinationStop;
  const directionLabel =
    group.direction === 2
      ? t("busDirectionLoop")
      : destName
        ? t("busTowards", { destination: destName })
        : group.subRouteName;
  const heading =
    group.subRouteName &&
    group.subRouteName !== routeName &&
    group.subRouteName !== directionLabel
      ? `${directionLabel}・${group.subRouteName}`
      : directionLabel;

  const times = (list: string[]) =>
    list.length > 0 ? (
      <div className="flex flex-wrap gap-1.5">
        {list.map((tm) => (
          <span
            key={tm}
            className="rounded bg-zinc-100 px-2 py-1 text-sm tabular-nums dark:bg-zinc-700"
          >
            {tm}
          </span>
        ))}
      </div>
    ) : (
      <span className="text-sm text-zinc-400">{t("none")}</span>
    );

  return (
    <div>
      {showHeading && (
        <div className="mb-1.5 text-base font-bold">{heading}</div>
      )}
      <DayColumns
        weekday={times(group.weekdayTimes)}
        holiday={times(group.holidayTimes)}
      />
    </div>
  );
};

/** [公車] 路線詳細資訊 modal：分類/業者/票價/分段 + 平日/假日定期時刻表（含截圖）。 */
const BusRouteInfoModal: FC<BusRouteInfoModalProps> = ({
  open,
  setOpen,
  route,
  info,
  isLoading,
  error,
}) => {
  const { t } = useTranslation();

  const { isCapturing, capture } = useCaptureShare({
    selector: ".bus-route-info-dialog",
    imageNamePrefix: route.routeName,
    gaEventName: GaEnum.BUS_ROUTE_DETAIL_CAPTURE,
  });

  // 分類（bus route index 來源）：市區公車・縣市 / 公路客運 / 台灣好行（・縣市）
  const cityName = route.city
    ? t(`busCity.${route.city}`, { defaultValue: route.city })
    : "";
  const categoryLabel =
    route.isTaiwanTrip || route.source === "taiwantrip"
      ? [t("busSourceTaiwanTrip"), cityName].filter(Boolean).join("・")
      : route.source === "city"
        ? [t("busSourceCity"), cityName].filter(Boolean).join("・")
        : t("busSourceIntercity");

  // 子線候選（route.subRouteName 有值，含展開路線的主線候選）只列該子線班表，
  // 與看板起站「下一班發車」的篩法一致；未展開路線（sub 無值）全列，保留附屬子線班表。
  // 班表分流：固定時刻照方向（往X）逐塊；班距整條路線彙整、不分方向（避免單向資料造成假「往X」）。
  // mixed 路線（白天班距 + 末班尾段固定時刻）兩者並存、互不覆蓋。
  const groups = (info?.schedules ?? []).filter(
    (g) => !route.subRouteName || g.subRouteName === route.subRouteName,
  );
  const fixedGroups = groups.filter(
    (g) => g.weekdayTimes.length > 0 || g.holidayTimes.length > 0,
  );
  const weekdayHeadways = dedupeHeadways(
    groups.flatMap((g) => g.weekdayHeadways ?? []),
  );
  const holidayHeadways = dedupeHeadways(
    groups.flatMap((g) => g.holidayHeadways ?? []),
  );
  const hasFixed = fixedGroups.length > 0;
  const hasHeadway = weekdayHeadways.length > 0 || holidayHeadways.length > 0;

  return (
    <>
      <Modal
        isOpen={open}
        onOpenChange={setOpen}
        classNames={{
          wrapper: `bus-route-info-dialog ${isCapturing ? "h-fit" : ""}`,
          base: "bg-background",
          header: "flex items-center justify-center gap-2",
        }}
        scrollBehavior={isCapturing ? "outside" : "inside"}
        size="lg"
        hideCloseButton={isCapturing}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{route.routeName}</ModalHeader>
              <ModalBody>
                {isLoading && !info ? (
                  <div className="py-4 text-center text-base text-muted-foreground">
                    {t("busInfoLoading")}
                  </div>
                ) : error && !info ? (
                  <NoTrainData apiError={error} />
                ) : info ? (
                  <div className="flex flex-col gap-3 text-left">
                    <div className="flex flex-col gap-2">
                      <ChipRow label={t("busInfoCategory")}>
                        {categoryLabel}
                      </ChipRow>
                      {(info.departureStop || info.destinationStop) && (
                        <ChipRow label={t("busInfoEndpoints")}>
                          {info.departureStop} - {info.destinationStop}
                        </ChipRow>
                      )}
                      {info.operators.length > 0 && (
                        <ChipRow label={t("busInfoOperator")}>
                          {info.operators.join(t("comma"))}
                        </ChipRow>
                      )}
                      {info.ticketPrice && (
                        <ChipRow label={t("busInfoTicketPrice")}>
                          {info.ticketPrice}
                        </ChipRow>
                      )}
                      {info.fareBufferZone && (
                        <ChipRow label={t("busInfoFareBufferZone")}>
                          {info.fareBufferZone}
                        </ChipRow>
                      )}
                      {/* 路線圖外連（官方頁）：併入資訊列同欄對齊；截圖時隱藏（靜態圖中連結無意義） */}
                      {!isCapturing && info.routeMapImageUrl && (
                        <ChipRow label={t("busInfoRouteMap")}>
                          <a
                            href={info.routeMapImageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="custom-cursor-pointer inline-flex items-center gap-1 text-primary hover:underline"
                          >
                            {t("busInfoRouteMapView")}
                            <ExternalLinkIcon />
                          </a>
                        </ChipRow>
                      )}
                    </div>

                    {!hasFixed && !hasHeadway ? (
                      <div className="mt-2">
                        <div className="mb-2 text-center text-base font-bold text-primary">
                          {t("busInfoSchedule")}
                        </div>
                        <div className="text-base text-zinc-400">
                          {t("busInfoNoSchedule")}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2 flex flex-col gap-6">
                        {/* 班距（發車間距）先列：涵蓋全日主要班次；不分方向 */}
                        {hasHeadway && (
                          <div>
                            <div className="mb-4 border-y border-primary py-2 text-center text-base font-bold text-primary">
                              {t("busInfoHeadwaySchedule")}
                            </div>
                            <HeadwaySection
                              weekday={weekdayHeadways}
                              holiday={holidayHeadways}
                              firstLast={info.firstLastBus}
                            />
                          </div>
                        )}
                        {/* 定期時刻表：固定發車時刻，照方向（往X）逐塊 */}
                        {hasFixed && (
                          <div>
                            <div className="mb-4 border-y border-primary py-2 text-center text-base font-bold text-primary">
                              {t("busInfoSchedule")}
                            </div>
                            <div className="flex flex-col gap-4">
                              {fixedGroups.map((g, i) => (
                                <TimetableBlock
                                  key={`${g.direction}-${g.subRouteName}-${i}`}
                                  group={g}
                                  departureStop={info.departureStop}
                                  destinationStop={info.destinationStop}
                                  routeName={info.routeName}
                                  showHeading={fixedGroups.length > 1}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : null}
              </ModalBody>
              <ModalFooter className="justify-center">
                {!isCapturing && info && (
                  <div className="relative mt-1 flex justify-center">
                    <Button
                      size="sm"
                      className="bg-primary text-primary-foreground"
                      onPress={onClose}
                    >
                      {t("closeBtn")}
                    </Button>
                    <div className="absolute left-[65px]">
                      <Button
                        variant="light"
                        size="sm"
                        onPress={capture}
                        aria-label="capture-btn"
                      >
                        <CaptureIcon />
                      </Button>
                    </div>
                  </div>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {isCapturing && <Loading />}
    </>
  );
};

export default BusRouteInfoModal;
