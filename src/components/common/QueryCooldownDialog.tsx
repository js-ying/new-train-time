import { UseRefreshCooldownResult } from "@/hooks/useRefreshCooldown";
import { useTranslation } from "next-i18next";
import { FC } from "react";
import CommonDialog from "./CommonDialog";

interface QueryCooldownDialogProps {
  /** 只取彈窗需要的三個欄位；attempt / reset 由呼叫端自己用 */
  cooldown: Pick<
    UseRefreshCooldownResult,
    "dialogOpen" | "setDialogOpen" | "frozenSeconds"
  >;
}

/** 查詢 / 刷新冷卻提示（凍結秒數）；公車手動刷新另附登入引導，不走此元件。 */
const QueryCooldownDialog: FC<QueryCooldownDialogProps> = ({ cooldown }) => {
  const { t } = useTranslation();

  return (
    <CommonDialog
      open={cooldown.dialogOpen}
      setOpen={cooldown.setDialogOpen}
      title="cooldownAlertTitle"
    >
      {t("sameQueryCountdownMsg", { seconds: cooldown.frozenSeconds })}
    </CommonDialog>
  );
};

export default QueryCooldownDialog;
