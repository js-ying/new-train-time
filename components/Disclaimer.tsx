import { useTranslation } from "next-i18next";
import { PageEnum } from "../enums/Page";

const Disclaimer = ({ page }: { page: PageEnum }) => {
  const { t } = useTranslation();
  return (
    <div className="text-center text-sm text-zinc-500 dark:text-zinc-400">
      {t(page + "DisclaimerMsg")}
    </div>
  );
};

export default Disclaimer;
