import { useTranslation } from "next-i18next";
import { FC } from "react";
import usePage from "../hooks/usePageHook";

const Disclaimer: FC = () => {
  const { t } = useTranslation();
  const { page } = usePage();

  return (
    <div className="text-center text-sm text-zinc-500 dark:text-zinc-400">
      {t(page + "DisclaimerMsg")}
    </div>
  );
};

export default Disclaimer;
