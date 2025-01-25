import { Alert } from "@mui/material";
import { useTranslation } from "next-i18next";
import usePage from "../hooks/usePageHook";

const TyphoonAlert = () => {
  const { t } = useTranslation();
  const { isTr, isThsr } = usePage();

  return (
    <Alert severity="error" variant="outlined">
      <div className="font-bold">{t("typhoonAlertMsg")}</div>
      <div>
        {isTr && (
          <a
            href="https://www.railway.gov.tw/tra-tip-web/tip/tip009/tip911/newsList"
            target="_blank"
          >
            https://www.railway.gov.tw/tra-tip-web/tip/tip009/tip911/newsList
          </a>
        )}

        {isThsr && (
          <a
            href="https://www.thsrc.com.tw/ArticleContent/6f0648a4-2e78-4a57-b669-44acd8e2daea"
            target="_blank"
          >
            https://www.thsrc.com.tw/ArticleContent/6f0648a4-2e78-4a57-b669-44acd8e2daea
          </a>
        )}
      </div>
    </Alert>
  );
};

export default TyphoonAlert;
