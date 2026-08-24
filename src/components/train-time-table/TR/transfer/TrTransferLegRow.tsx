import CommonDialog from "@/components/common/CommonDialog";
import Loading from "@/components/common/Loading";
import TrTrainTimeDetailDialog from "@/components/train-time-table/TR/TrTrainTimeDetailDialog";
import { GaEnum } from "@/enums/GaEnum";
import useLang from "@/hooks/useLang";
import { JsyTrTimetable, JsyTrTransferLeg } from "@/models/jsy-tr-info";
import { getJsyTrTrainStopTimes } from "@/services/trService";
import DateUtils from "@/utils/DateUtils";
import { gaClickEvent } from "@/utils/GaUtils";
import { getNameLangKey } from "@/utils/LocaleUtils";
import { getTimeDiff, getTrTrainTypeNameByCode } from "@/utils/TrainInfoUtils";
import { useTranslation } from "next-i18next";
import { FC, useMemo, useState } from "react";
import { isShowTrOrderBtn } from "../TrOrder";
import TrTimeInfoRightArea from "../TrTimeInfoRightArea";
import TrTrainService from "../TrTrainServices";
import TrTrainType from "../TrTrainType";
import TrTripLine from "../TrTripLine";

interface TrTransferLegRowProps {
  leg: JsyTrTransferLeg;
  trainDate: string;
}

/**
 * 轉乘卡片展開後的單段列車 row。
 * 排版對齊直達卡片 TrTrainTimeInfo（grid-cols-4，左 1 / 中 2 / 右 1 + 右上 absolute 服務 icon）。
 * 與直達的差異：中間欄上方多一行該段「上車站 → 下車站」；其餘（車號/車種/全程起迄、時刻、搭乘時長、票價、訂票、列車服務）皆對齊直達樣式。
 * 點擊即時查該車完整停靠（後端不隨轉乘結果回傳），複用既有 detail dialog；停靠表強調該段上下車站。
 */
const TrTransferLegRow: FC<TrTransferLegRowProps> = ({ leg, trainDate }) => {
  const [open, setOpen] = useState(false);
  // 列車詳情（完整停靠）：點開才查，查過留在 state
  const [detail, setDetail] = useState<JsyTrTimetable | null>(null);
  const [loading, setLoading] = useState(false);
  const [staleDialogOpen, setStaleDialogOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { isTw } = useLang();
  const langKey = getNameLangKey(i18n.language);

  // 把 leg 包成右區塊期待的 JsyTrTimetable 形狀；stopTimes 只帶該段上下車兩站（訂票 OD 與發車時間判斷皆以該段為準）
  const pseudoTimetable: JsyTrTimetable = useMemo(
    () => ({
      trainInfo: leg.trainInfo,
      stopTimes: [leg.boardStopTime, leg.alightStopTime],
      fareList: leg.fare ? [leg.fare] : [],
      delayInfo: [],
      trainDate,
    }),
    [leg, trainDate],
  );

  const trainTypeName = getTrTrainTypeNameByCode(
    leg.trainInfo.trainTypeCode,
    i18n.language,
  );

  // 該段上下車時間區間（依 boardStopTime / alightStopTime，避免使用 stopTimes[0]/[末] 誤抓全程起迄時刻）
  const timeRange = `${leg.boardStopTime.departureTime} - ${leg.alightStopTime.arrivalTime}`;

  // 該段搭乘時長（跨午夜由 getTimeDiff 內部處理 endDate）
  const durationText = useMemo(() => {
    const diff = getTimeDiff(
      leg.boardStopTime.departureTime,
      leg.alightStopTime.arrivalTime,
      trainDate,
    );
    return t("trainInfoTimeDiff", { hour: diff.hour, min: diff.min });
  }, [
    leg.boardStopTime.departureTime,
    leg.alightStopTime.arrivalTime,
    trainDate,
    t,
  ]);

  const handleClick = async () => {
    // 分頁擱置跨日：trainDate 已成過去日期，查詳情必定落空 → 只提示過期，重查交還使用者
    if (DateUtils.isBefore(trainDate, DateUtils.getCurrentDate())) {
      setStaleDialogOpen(true);
      return;
    }

    gaClickEvent(GaEnum.TR_TRANSFER_LEG_INFO);
    if (detail) {
      setOpen(true);
      return;
    }
    if (loading) return; // 查詢中忽略重複點擊

    // 延遲顯示 loading：cache 命中通常 <250ms 完成，計時器未觸發即取消 → 不閃 loading
    const loadingTimer = setTimeout(() => setLoading(true), 250);
    try {
      const result = await getJsyTrTrainStopTimes(
        leg.trainInfo.trainNo,
        trainDate,
      );
      // 詳情 API 不回票價，沿用該段 OD 票價
      setDetail({ ...result, fareList: pseudoTimetable.fareList });
      setOpen(true);
    } catch {
      // 詳情查詢失敗：靜默不開 dialog（卡片其餘資訊仍可用）
    } finally {
      clearTimeout(loadingTimer);
      setLoading(false);
    }
  };

  return (
    <>
      <div
        tabIndex={0}
        role="button"
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
        className={`custom-cursor-pointer relative grid grid-cols-4 items-center
          gap-x-3 rounded-md border border-solid border-foreground/40 p-2
          ${
            isShowTrOrderBtn(pseudoTimetable)
              ? "min-h-[108px] md:min-h-fit"
              : ""
          }`}
      >
        {/* 左：車號+山線 / 車種 chip / 全程起迄站 — 對齊直達 TrTimeInfoLeftArea */}
        <div className="flex flex-col gap-1.5 text-center text-sm">
          <div>
            <TrTripLine
              trainNo={leg.trainInfo.trainNo}
              tripLine={leg.trainInfo.tripLine}
            />
          </div>
          <div>
            <TrTrainType
              code={leg.trainInfo.trainTypeCode}
              trainTypeName={trainTypeName}
              className={isTw ? "mx-auto block max-w-14 text-center" : ""}
            />
          </div>
          <div>
            {leg.trainInfo.startingStationName[langKey]} -{" "}
            {leg.trainInfo.endingStationName[langKey]}
          </div>
        </div>

        {/* 中：該段上下車站 / 時刻區間 / 搭乘時長 — 對齊直達 TrTimeInfoMidArea，多加上方該段 OD */}
        <div className="col-span-2 text-center">
          <div className="mb-1 truncate text-sm text-muted-foreground">
            {leg.boardStopTime.stationName[langKey]}
            {" ➔ "}
            {leg.alightStopTime.stationName[langKey]}
          </div>
          <div className="text-md">{timeRange}</div>
          <div className="text-sm text-muted-foreground">{durationText}</div>
        </div>

        {/* 右：票價 / 訂票按鈕 — 對齊直達 TrTimeInfoRightArea */}
        <div className="text-center">
          <TrTimeInfoRightArea data={pseudoTimetable} />
        </div>

        {/* 列車服務 icon（右上絕對定位，對齊直達卡片） */}
        <div className="absolute right-1.5 top-1.5 flex gap-1">
          <TrTrainService data={leg.trainInfo} />
        </div>
      </div>

      {detail && (
        <TrTrainTimeDetailDialog
          open={open}
          setOpen={setOpen}
          data={detail}
          highlightStationIds={[
            leg.boardStopTime.stationId,
            leg.alightStopTime.stationId,
          ]}
        />
      )}
      {loading && <Loading />}

      {/* 資料已非當日（分頁擱置跨日）：提示過期，由使用者自行重查 */}
      <CommonDialog
        open={staleDialogOpen}
        setOpen={setStaleDialogOpen}
        title="reminderAlertTitle"
      >
        {t("dataExpiredMsg")}
      </CommonDialog>
    </>
  );
};

export default TrTransferLegRow;
