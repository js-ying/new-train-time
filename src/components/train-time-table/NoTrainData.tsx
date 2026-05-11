import { ApiError } from "@/models/problem-details";
import DateUtils from "@/utils/DateUtils";
import Alert from "@mui/material/Alert";
import { useTranslation } from "next-i18next";
import { FC } from "react";
import { LocaleEnum } from "../../enums/LocaleEnum";

interface NoTrainDataProps {
  /** 來自 useTrainSearch 的 API 錯誤；非 null 即顯示紅 Alert */
  apiError: ApiError | null;
  /** 是否為轉乘模式無資料；切換 Alert 文案（含「已有直達」常見原因） */
  isTransfer?: boolean;
}

/**
 * 搜尋結果無資料時的占位元件：
 * - apiError 為 null：黃色 Alert，提示「時段太晚 / 兩站無班次」
 * - apiError 非 null：紅色 Alert，依 ApiError.code 對應 i18n 訊息
 * - isTransfer：轉乘模式專用文案（提示可能該 OD 已有直達）
 */
const NoTrainData: FC<NoTrainDataProps> = ({ apiError, isTransfer }) => {
  const { t, i18n } = useTranslation();

  if (apiError) {
    const messageKey = `errors.${apiError.code}`;
    const messageText = i18n.exists(messageKey)
      ? t(messageKey)
      : t("noTrainDataDueToApiErrorMsg");
    const trailingSpace = i18n.language === LocaleEnum.TW ? "" : " ";

    return (
      <Alert severity="error" variant="outlined" className="rounded-xl">
        <div className="font-bold">
          {messageText}
          {trailingSpace}
          {`(${DateUtils.getCurrentDatetime()})`}
        </div>
      </Alert>
    );
  }

  if (isTransfer) {
    return (
      <Alert severity="warning" variant="outlined" className="rounded-xl">
        <div className="mb-3 font-bold">{t("noTransferDataTitleMsg")}</div>
        {/* Tailwind Preflight 會把 ul 的 list-style 重置成 none，需用 list-disc 還原符號 */}
        <ul className="list-disc list-inside">
          <li>{t("noTransferDueToDirectMsg")}</li>
          <li>{t("noTransferInThisTimeMsg")}</li>
        </ul>
      </Alert>
    );
  }

  return (
    <Alert severity="warning" variant="outlined" className="rounded-xl">
      <div className="mb-3 font-bold">{t("noTrainDataTitleMsg")}</div>
      <ul className="list-disc list-inside">
        <li>{t("noTrainInThisTimeMsg")}</li>
        <li>{t("noTrainStopBetweenStationsMsg")}</li>
      </ul>
    </Alert>
  );
};

export default NoTrainData;
