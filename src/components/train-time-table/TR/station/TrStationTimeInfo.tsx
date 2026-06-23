import Loading from "@/components/common/Loading";
import { SettingContext } from "@/contexts/SettingContext";
import { GaEnum } from "@/enums/GaEnum";
import useLang from "@/hooks/useLang";
import { JsyTrStationTrain, JsyTrTimetable } from "@/models/jsy-tr-info";
import { getJsyTrTrainStopTimes } from "@/services/trService";
import { gaClickEvent } from "@/utils/GaUtils";
import { getNameLangKey } from "@/utils/LocaleUtils";
import {
  getTrTrainTypeNameByCode,
  getTrTripLineNameByValue,
  isTrTrainOnlyTicket,
} from "@/utils/TrainInfoUtils";
import { useTranslation } from "next-i18next";
import { FC, useContext, useState } from "react";
import TrDelay from "../TrDelay";
import TrTrainService from "../TrTrainServices";
import TrTrainTimeDetailDialog from "../TrTrainTimeDetailDialog";
import TrTrainType from "../TrTrainType";

interface TrStationTimeInfoProps {
  data: JsyTrStationTrain;
  /** 該班所屬日期（查列車詳情用；單站時刻表只有今日，但仍由上層帶入以利日後跨日） */
  trainDate: string;
}

/**
 * [台鐵] 單站時刻表的一班車（發車看板）。
 * 版面比照 OD 列車卡(TrTrainTimeInfo) 的左中右三欄。
 * 左：車次（放大）/ 山海線、車種；中：誤點 + 發車時刻；右：開往⟨迄站⟩（強調）+ ⟨起站⟩起。
 * 右欄保留起站：起站離本站越遠、車上累積乘客越多，可輔助判斷座位是否充足。
 * 車種 label 中文版手機占滿、桌機限寬；英文版維持無底色（不傳 className）。
 * min-h 拉高卡片，避免右欄文字撞到右上角的服務 icon（絕對定位）。
 * 卡片下方比照 OD：無站票提醒（依車種）+ 台鐵註記（吃 Settings showTrTrainNote）。
 * 點卡片 → 即時查該車完整停靠（CSR on-demand，命中後端 cache），複用 OD 詳情 dialog；
 * 詳情停靠表只強調查詢站（停靠表為該車完整路徑，無迄站概念）。
 * 已過站班次於上層 TrStationTimeTable 已濾除。
 */
const TrStationTimeInfo: FC<TrStationTimeInfoProps> = ({ data, trainDate }) => {
  const { t, i18n } = useTranslation();
  const { isTw } = useLang();
  const { showTrTrainNote } = useContext(SettingContext);
  const langKey = getNameLangKey(i18n.language);
  const tripLineName = getTrTripLineNameByValue(
    data.trainInfo.tripLine,
    i18n.language,
  );
  // 無站票提醒（依車種）與台鐵註記，比照 OD 卡片
  const isOnlyTicket = isTrTrainOnlyTicket(data.trainInfo.trainTypeCode);
  const note = data.trainInfo.note;

  // 列車詳情（完整停靠）：點開才查，查過快取於 detail
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<JsyTrTimetable | null>(null);

  const openDetail = async () => {
    gaClickEvent(GaEnum.TR_TRAIN_INFO);
    if (detail) {
      setOpen(true);
      return;
    }
    if (loading) return; // 查詢中忽略重複點擊

    // 延遲顯示 loading：cache 命中通常 <250ms 完成，計時器未觸發即取消 → 不閃 loading；
    // 真的較慢（cache miss）才顯示，避免「一閃而過」被誤認卡頓。
    const loadingTimer = setTimeout(() => setLoading(true), 250);
    try {
      const result = await getJsyTrTrainStopTimes(
        data.trainInfo.trainNo,
        trainDate,
      );
      setDetail(result);
      setOpen(true);
    } catch {
      // 詳情查詢失敗：靜默不開 dialog（卡片其餘資訊仍可用）
    } finally {
      clearTimeout(loadingTimer);
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={openDetail}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") openDetail();
        }}
        className="custom-cursor-pointer relative grid min-h-[100px] grid-cols-4
          items-center rounded-md border border-solid border-foreground p-2"
      >
        {/* 左：車次（放大）+ 山海線（小字）、車種 */}
        <div className="flex flex-col gap-1.5 text-center">
          <div className="flex flex-wrap items-baseline justify-center gap-1">
            <span className="text-lg">{data.trainInfo.trainNo}</span>
            {tripLineName && (
              <span className="text-sm text-muted-foreground">
                {tripLineName}
              </span>
            )}
          </div>
          <div className="text-sm">
            <TrTrainType
              code={data.trainInfo.trainTypeCode}
              trainTypeName={getTrTrainTypeNameByCode(
                data.trainInfo.trainTypeCode,
                i18n.language,
              )}
              className={isTw ? "mx-auto block max-w-14 text-center" : ""}
            />
          </div>
        </div>

        {/* 中：誤點（僅今日 90 分鐘內列車有值）+ 發車時刻 */}
        <div className="col-span-2 text-center">
          <TrDelay dataList={data.delayInfo} />
          <div className="text-2xl tabular-nums">
            {data.stopTime.departureTime}
          </div>
        </div>

        {/* 右：開往⟨迄站⟩（強調）+ ⟨起站⟩起（輔助判斷人潮 / 座位） */}
        <div className="flex flex-col gap-0.5 text-center">
          {/* 「開往」維持與「XX 起」同級，只放大終點站名以強調 */}
          <span className="flex flex-wrap items-baseline justify-center gap-1">
            <span className="text-sm">{t("trStationBoundForPrefix")}</span>
            <span className="text-base font-semibold">
              {data.trainInfo.endingStationName[langKey]}
            </span>
          </span>
          <span className="text-sm text-muted-foreground">
            {t("trStationFromOrigin", {
              origin: data.trainInfo.startingStationName[langKey],
            })}
          </span>
        </div>

        {/* 列車服務（右上角小 icon，比照 OD） */}
        <div className="absolute right-1.5 top-1.5 flex gap-1">
          <TrTrainService data={data.trainInfo} />
        </div>
      </div>

      {/* 無站票提醒（電子票證/定期票勿搭）：依車種，比照 OD */}
      {isOnlyTicket && (
        <div className="mt-1 text-xs text-primary">{t("eTicketAlertMsg")}</div>
      )}

      {/* 台鐵註記：僅中文且 Settings 開啟、有 note 時顯示 */}
      {isTw && showTrTrainNote && note && (
        <div className="mt-1 text-xs text-muted-foreground">{note}</div>
      )}

      {/* 列車詳情 dialog（複用 OD）：停靠表只強調查詢站（該班在此站的 stopTime） */}
      {detail && (
        <TrTrainTimeDetailDialog
          open={open}
          setOpen={setOpen}
          data={detail}
          highlightStationIds={[data.stopTime.stationId]}
        />
      )}
      {loading && <Loading />}
    </div>
  );
};

export default TrStationTimeInfo;
