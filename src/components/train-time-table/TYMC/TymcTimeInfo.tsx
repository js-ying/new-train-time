import { GaEnum } from "@/enums/GaEnum";
import { useTymcTrainDisplay } from "@/hooks/display/useTymcTrainDisplay";
import { JsyTymcInfo } from "@/models/jsy-tymc-info";
import { gaClickEvent } from "@/utils/GaUtils";
import { useTranslation } from "next-i18next";
import { FC, memo, useRef, useState } from "react";
import TymcTrainTimeDetailDialog from "./TymcTrainTimeDetailDialog";

interface TymcTimeInfoProps {
  tymcTimeTable: JsyTymcInfo["timeTables"][0];
  fareList: JsyTymcInfo["fareList"];
  trainDate: string;
  startStationId: string;
  endStationId: string;
}

/**
 * [桃園捷運] 列車時刻資訊
 */
const TymcTimeInfo: FC<TymcTimeInfoProps> = ({
  tymcTimeTable,
  fareList,
  trainDate,
  startStationId,
  endStationId,
}) => {
  const [open, setOpen] = useState(false);
  // 延後掛載明細 Modal：關閉狀態的列不建立 HeroUI Modal 的 useModal hook 樹，
  // 車種篩選重渲染時不再為每一列重跑整棵 overlay/aria hook（首次開啟後保留掛載以維持關閉動畫）
  const hasOpened = useRef(false);
  if (open) hasOpened.current = true;
  const { t } = useTranslation();

  const { isPassed, isNormal, durationText, price } = useTymcTrainDisplay(
    tymcTimeTable,
    fareList,
    trainDate,
  );

  const openDetail = () => {
    gaClickEvent(GaEnum.THSR_TRAIN_INFO);
    setOpen(true);
  };

  return (
    <div className={!open && isPassed ? "opacity-40" : ""}>
      <div
        tabIndex={0}
        role="button"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            openDetail();
          }
        }}
        className="custom-cursor-pointer relative grid grid-cols-4 items-center
          justify-between rounded-md border border-solid border-foreground p-2
          transition duration-150 ease-out"
        onClick={openDetail}
      >
        {/* Left */}
        <div className="text-center text-sm">
          <span
            className={`rounded px-1 py-0.5 text-white ${
              isNormal
                ? "bg-sky-500 dark:bg-sky-500/80"
                : "bg-rose-500 dark:bg-rose-500/80"
            }`}
          >
            {isNormal ? t("normalArrive") : t("directlyArrive")}
          </span>
        </div>
        {/* Mid */}
        <div className="col-span-2 text-center">
          <div className="flex items-center justify-center gap-1.5">
            <span className="whitespace-nowrap">
              {tymcTimeTable.departureTime} -{" "}
              {tymcTimeTable.arrivalTime || t("unknown")}
            </span>
            {durationText && (
              <span className="whitespace-nowrap text-sm">
                ± 3 {t("minute")}
              </span>
            )}
          </div>
          {durationText && (
            <div className="whitespace-nowrap text-sm text-muted-foreground">
              {t("about")} {durationText}
            </div>
          )}
        </div>
        {/* Right */}
        <div className="text-center text-sm">NTD {price}</div>
      </div>

      {(open || hasOpened.current) && (
        <TymcTrainTimeDetailDialog
          open={open}
          setOpen={setOpen}
          tymcTimeTable={tymcTimeTable}
          fareList={fareList}
          trainDate={trainDate}
          startStationId={startStationId}
          endStationId={endStationId}
        />
      )}
    </div>
  );
};

// React.memo：車種篩選只改變 filterTymcTrainTimeTable，存活的列 props（同一 timeTable ref）不變即略過重渲染，
// 避免整批 row 重跑 useTymcTrainDisplay 與 Modal 子樹（桃捷 search 頁 INP 的主因）。
export default memo(TymcTimeInfo);
