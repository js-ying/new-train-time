import { ApiError } from "@/models/problem-details";
import DateUtils from "@/utils/DateUtils";
import Alert from "@mui/material/Alert";
import { useTranslation } from "next-i18next";
import { FC } from "react";
import { LocaleEnum } from "../../enums/LocaleEnum";

interface NoTrainDataProps {
  /** 來自 useTrainSearch 的 API 錯誤；非 null 即顯示紅 Alert */
  apiError: ApiError | null;
  /** 是否為轉乘模式無資料；切換 Alert 文案（含「可能不需轉乘」常見原因） */
  isTransfer?: boolean;
  /** 是否為台鐵（TR）；direct 模式無資料時用以追加「改試轉乘」引導 */
  isTr?: boolean;
}

/**
 * 搜尋結果無資料時的占位元件：
 * - apiError 為 null：黃色 Alert，提示「時段太晚 / 兩站無班次」
 * - apiError 非 null：紅色 Alert，依 ApiError.code 對應 i18n 訊息
 * - isTransfer：轉乘模式專用文案（提示可能不需轉乘，可改試直達）
 * - isTr + direct：追加「可能無直達，可改試轉乘」引導（高鐵/桃捷無 transfer 模式不顯示）
 */
const NoTrainData: FC<NoTrainDataProps> = ({ apiError, isTransfer, isTr }) => {
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
          <li>{t("noTransferInThisTimeMsg")}</li>
          <li>{t("noTransferDueToDirectMsg")}</li>
        </ul>
      </Alert>
    );
  }

  return (
    <Alert severity="warning" variant="outlined" className="rounded-xl">
      <div className="mb-3 font-bold">{t("noTrainDataTitleMsg")}</div>
      <ul className="list-disc list-inside">
        <li>{t("noTrainInThisTimeMsg")}</li>
        {/* 台鐵有「轉乘」模式可引導；高鐵/桃捷無 transfer，維持「兩站間無停靠列車」 */}
        {isTr ? (
          <li>{t("noTrainDataTryTransferMsg")}</li>
        ) : (
          <li>{t("noTrainStopBetweenStationsMsg")}</li>
        )}
      </ul>
    </Alert>
  );
};

export default NoTrainData;
