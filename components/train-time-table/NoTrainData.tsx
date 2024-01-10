import { Alert } from "@mui/material";
import { useTranslation } from "next-i18next";
import DateUtils from "../../utils/date-utils";

const NoTrainData = ({ isApiHealth }) => {
  const { t } = useTranslation();

  return (
    <div>
      {isApiHealth && (
        <Alert severity="warning" variant="outlined">
          <div className="mb-3 font-bold">{t("noTrainDataTitleMsg")}</div>
          <div>
            <li>{t("noTrainInThisTimeMsg")}</li>
            <li>{t("noTrainStopBetweenStationsMsg")}</li>
          </div>
        </Alert>
      )}

      {!isApiHealth && (
        <Alert severity="error" variant="outlined">
          <div className="font-bold">
            {t("noTrainDataDueToApiErrorMsg")}
            {`(${DateUtils.getCurrentDatetime()})`}
          </div>
        </Alert>
      )}
    </div>
  );
};

export default NoTrainData;
