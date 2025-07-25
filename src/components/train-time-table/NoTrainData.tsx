import { Alert } from "@mui/material";
import { useTranslation } from "next-i18next";
import { FC } from "react";
import { LocaleEnum } from "../../enums/LocaleEnum";
import DateUtils from "../../utils/DateUtils";

interface NoTrainDataProps {
  isApiHealth: boolean;
  alertMsg: string;
}

const NoTrainData: FC<NoTrainDataProps> = ({ isApiHealth, alertMsg }) => {
  const { t, i18n } = useTranslation();

  return (
    <div>
      {isApiHealth && (
        <Alert severity="warning" variant="outlined" className="rounded-xl">
          <div className="mb-3 font-bold">{t("noTrainDataTitleMsg")}</div>
          <div>
            <li>{t("noTrainInThisTimeMsg")}</li>
            <li>{t("noTrainStopBetweenStationsMsg")}</li>
          </div>
        </Alert>
      )}

      {!isApiHealth && (
        <>
          <Alert severity="error" variant="outlined" className="rounded-xl">
            <div className="font-bold">
              {t("noTrainDataDueToApiErrorMsg")}
              {`${i18n.language === LocaleEnum.TW ? "" : " "}`}
              {`(${DateUtils.getCurrentDatetime()})`}
            </div>
            <div>{alertMsg.toString()}</div>
          </Alert>
        </>
      )}
    </div>
  );
};

export default NoTrainData;
