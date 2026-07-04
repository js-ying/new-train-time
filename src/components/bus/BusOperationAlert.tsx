import CommonDialog from "@/components/common/CommonDialog";
import { ALERT_STATUS_COLORS } from "@/components/search-area/alert/alertStatusColors";
import { GaEnum } from "@/enums/GaEnum";
import { JsyBusAlert } from "@/models/jsy-bus-info";
import DateUtils from "@/utils/DateUtils";
import { gaClickEvent } from "@/utils/GaUtils";
import { Button } from "@heroui/react";
import { useTranslation } from "next-i18next";
import { FC, useState } from "react";

interface BusOperationAlertProps {
  /** 命中本路線且生效中的公告（arrivals 回應附帶）；空 / 未帶不渲染 */
  alerts?: JsyBusAlert[];
}

/** [公車] 路線營運通阻公告：狀態點 + 摘要按鈕，點開完整公告列表（樣式對齊三鐵 OperationAlert） */
const BusOperationAlert: FC<BusOperationAlertProps> = ({ alerts }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  if (!alerts || alerts.length === 0) return null;

  const status = alerts.some((a) => a.status === "danger")
    ? "danger"
    : "warning";
  const colors = ALERT_STATUS_COLORS.get(status)!;
  const displayBtnName = alerts.some((a) => a.title.includes("颱風"))
    ? "typhoonImpact"
    : alerts.some((a) => a.title.includes("地震"))
      ? "earthquakeImpact"
      : colors.i18n;

  return (
    <>
      {/* 圓點 + 負偏移按鈕：同三鐵 OperationAlert 非 compact 樣式（dot-static 掛容器左外、按鈕 -left-2.5 貼近） */}
      <div className="fade-in">
        <span className={`dot-static z-10 ${colors.bg}`}></span>
        <Button
          className={`-left-2.5 min-w-fit text-sm ${colors.text}`}
          variant="light"
          size="sm"
          onPress={() => {
            gaClickEvent(GaEnum.BUS_OPERATION_ALERT);
            setOpen(true);
          }}
        >
          {t(displayBtnName)}
          {alerts.length > 1 ? ` (${alerts.length})` : ""}
        </Button>
      </div>

      <CommonDialog
        title="operationAlertTitle"
        size="2xl"
        open={open}
        setOpen={setOpen}
        bodyTextAlign="text-left"
      >
        {alerts.map((alert, index) => (
          <div
            key={`${alert.title}-${alert.publishTime}`}
            className={`
              border-l-4 pl-4 ${ALERT_STATUS_COLORS.get(alert.status)!.border}
              ${index < alerts.length - 1 ? " mb-4 " : ""}
            `}
          >
            <div className="whitespace-pre-line">
              <span
                className={`font-bold ${ALERT_STATUS_COLORS.get(alert.status)!.text}`}
              >
                {alert.title}{" "}
                {alert.startTime &&
                  alert.endTime &&
                  `${DateUtils.dateFormatter(alert.startTime, "MM/DD HH:mm")} - ${DateUtils.dateFormatter(alert.endTime, "MM/DD HH:mm")}`}
              </span>
              {alert.desc && `\n${alert.desc}`}
            </div>
          </div>
        ))}
      </CommonDialog>
    </>
  );
};

export default BusOperationAlert;
