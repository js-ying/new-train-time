import { useTranslation } from "next-i18next";
import { FC } from "react";

const Disclaimer: FC = () => {
  const { t } = useTranslation();

  return (
    <div className="whitespace-pre-line text-center text-sm text-muted-foreground">
      {t("disclaimerMsg")}
    </div>
  );
};

export default Disclaimer;
