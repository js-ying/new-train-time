import { Alert } from "@mui/material";
import { useTranslation } from "next-i18next";

const NoTrainData = () => {
  const { t } = useTranslation();

  return (
    <div>
      <Alert severity="warning" variant="outlined">
        <div className="mb-3 font-bold">{t("noTrainDataTitleMsg")}</div>
        <div>
          <li>{t("noTrainInThisTimeMsg")}</li>
          <li>{t("noTrainStopBetweenStationsMsg")}</li>
        </div>
      </Alert>
    </div>
  );
};

export default NoTrainData;
