import CommonDialog from "@/components/common/CommonDialog";
import { GaEnum } from "@/enums/GaEnum";
import { PageEnum } from "@/enums/PageEnum";
import useOperationAlert from "@/hooks/useOperationAlert";
import usePage from "@/hooks/usePage";
import DateUtils from "@/utils/DateUtils";
import { gaClickEvent } from "@/utils/GaUtils";
import { Button } from "@heroui/react";
import { useTranslation } from "next-i18next";
import { FC, useMemo, useState } from "react";

const OperationAlert: FC = () => {
  const { t } = useTranslation();
  const jsyOperationAlert = useOperationAlert();
  const { page } = usePage();
  const [open, setOpen] = useState(false);
  const map = {
    [PageEnum.TR]: GaEnum.TR_OPERATION_ALERT,
    [PageEnum.THSR]: GaEnum.THSR_OPERATION_ALERT,
    [PageEnum.TYMC]: GaEnum.TYMC_OPERATION_ALERT,
  };

  const statusColorMap = useMemo(() => {
    const map = new Map<
      string,
      { text: string; bg: string; border: string; i18n: string }
    >();
    map.set("normal", {
      text: "",
      bg: "bg-emerald-600 dark:bg-emerald-400",
      border: "border-emerald-600 dark:border-emerald-400",
      i18n: "normalOpStatus",
    });
    map.set("warning", {
      text: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-600 dark:bg-orange-400",
      border: "border-orange-600 dark:border-orange-400",
      i18n: "warningOpStatus",
    });
    map.set("danger", {
      text: "text-red-600 dark:text-red-400",
      bg: "bg-red-600 dark:bg-red-400",
      border: "border-red-600 dark:border-red-400",
      i18n: "dangerOpStatus",
    });
    return map;
  }, []);

  const displayBtnName = useMemo(() => {
    if (!jsyOperationAlert) return "";
    if (
      jsyOperationAlert.alerts.some((alert) => alert.title.includes("颱風"))
    ) {
      return "typhoonImpact";
    }
    if (
      jsyOperationAlert.alerts.some((alert) => alert.title.includes("地震"))
    ) {
      return "earthquakeImpact";
    }
    return statusColorMap.get(jsyOperationAlert.status)?.i18n || "";
  }, [jsyOperationAlert, statusColorMap]);

  if (!jsyOperationAlert) return;

  return (
    <>
      {jsyOperationAlert.status !== "error" && (
        <>
          <div className="fade-in">
            <span
              className={`dot-static z-10 ${statusColorMap.get(jsyOperationAlert.status).bg}`}
            ></span>
            <Button
              className={`-left-2.5 min-w-fit text-sm ${statusColorMap.get(jsyOperationAlert.status).text}`}
              variant="light"
              size="sm"
              onPress={() => {
                gaClickEvent(map[page]);
                setOpen(true);
              }}
            >
              {t(displayBtnName)}
              {jsyOperationAlert.alerts.length > 1
                ? ` (${jsyOperationAlert.alerts.length})`
                : ""}
            </Button>
          </div>

          <CommonDialog
            title="即時營運通阻訊息"
            size="2xl"
            open={open}
            setOpen={setOpen}
            bodyTextAlign="text-left"
          >
            {jsyOperationAlert.alerts.map((alert, index) => (
              <div
                key={`${alert.title}-${alert.publishTime}`} // 使用組合鍵以確保唯一性
                className={`
                  border-l-4 pl-4 ${statusColorMap.get(alert.status).border}
                  ${index < jsyOperationAlert.alerts.length - 1 ? " mb-4 " : ""}
                `}
              >
                {alert.status === "normal" && (
                  <div>
                    {DateUtils.dateFormatter(
                      alert.publishTime,
                      "YYYY-MM-DD HH:mm:ss",
                    )}
                  </div>
                )}
                <div className="whitespace-pre-line">
                  <span
                    className={`font-bold ${statusColorMap.get(jsyOperationAlert.status).text}`}
                  >
                    {alert.title}{" "}
                    {alert.startTime &&
                      `${DateUtils.dateFormatter(alert.startTime, "YYYY-MM-DD")}-${DateUtils.dateFormatter(alert.endTime, "YYYY-MM-DD")}`}
                  </span>
                  {alert.desc && `\n${alert.desc}`}
                </div>
              </div>
            ))}
          </CommonDialog>
        </>
      )}
    </>
  );
};

export default OperationAlert;
