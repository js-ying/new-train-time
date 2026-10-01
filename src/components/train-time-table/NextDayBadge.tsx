import { useTranslation } from "next-i18next";
import { FC } from "react";

/** 隔日午夜後上車的班次標示；獨立一行疊在時程上方，避免撐寬中欄擠壓右欄 */
const NextDayBadge: FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <span className="rounded bg-amber-100 px-1 text-xs text-amber-600 dark:bg-amber-600/40 dark:text-amber-300">
        {t("nextDayBadge")}
      </span>
    </div>
  );
};

export default NextDayBadge;
