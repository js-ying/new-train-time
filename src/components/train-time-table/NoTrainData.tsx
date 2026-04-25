import { ApiError } from "@/models/problem-details";
import DateUtils from "@/utils/DateUtils";
import Alert from "@mui/material/Alert";
import { useTranslation } from "next-i18next";
import { FC } from "react";
import { LocaleEnum } from "../../enums/LocaleEnum";

interface NoTrainDataProps {
  /** 來自 useTrainSearch 的 API 錯誤；非 null 即顯示紅 Alert */
  apiError: ApiError | null;
}

/**
 * 搜尋結果無資料時的占位元件：
 * - apiError 為 null：黃色 Alert，提示「時段太晚 / 兩站無班次」
 * - apiError 非 null：紅色 Alert，依 ApiError.code 對應 i18n 訊息
 */
const NoTrainData: FC<NoTrainDataProps> = ({ apiError }) => {
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

  return (
    <Alert severity="warning" variant="outlined" className="rounded-xl">
      <div className="mb-3 font-bold">{t("noTrainDataTitleMsg")}</div>
      <div>
        <li>{t("noTrainInThisTimeMsg")}</li>
        <li>{t("noTrainStopBetweenStationsMsg")}</li>
      </div>
    </Alert>
  );
};

export default NoTrainData;
