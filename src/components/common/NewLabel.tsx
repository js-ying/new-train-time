import { useTranslation } from "next-i18next";
import { FC } from "react";

const NewLabel: FC = () => {
  const { t } = useTranslation();

  return (
    <span className="flex h-4 animate-pulse items-center justify-center rounded-full bg-rose-500 px-2 text-[10px] font-black text-zinc-50 shadow-sm dark:bg-rose-500/80">
      {t("new")}
    </span>
  );
};

export default NewLabel;
