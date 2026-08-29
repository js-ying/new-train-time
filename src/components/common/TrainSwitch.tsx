import { PageEnum } from "@/enums/PageEnum";
import usePage from "@/hooks/usePage";
import useTransportNavClick from "@/hooks/useTransportNavClick";
import { getHomePath } from "@/utils/PageUtils";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { FC } from "react";

const TrainSwitch: FC = () => {
  const { t } = useTranslation();
  const { page } = usePage();
  const handleTrainSwitch = useTransportNavClick();
  const trains = [PageEnum.TR, PageEnum.THSR, PageEnum.TYMC, PageEnum.BUS];

  return (
    <nav
      aria-label="交通工具切換"
      className="flex items-center gap-1 rounded-lg"
    >
      {/* Transport Tabs */}
      {trains.map((train) => {
        const isActive = page === train;
        return (
          <Link
            key={train}
            href={getHomePath(train)}
            title={t(`${train}Title`)}
            // accessible name 以可見文字開頭，符合 WCAG 2.5.3（label 與可見文字一致）
            aria-label={`${t(`${train}Dropdown`)} ${t(`${train}Title`)}`}
            onClick={() => handleTrainSwitch(train)}
            className={`
              rounded-md px-3 py-1 text-sm font-bold transition-all
              ${
                isActive
                  ? "bg-muted/80 text-primary shadow-sm dark:bg-muted"
                  : "text-muted-foreground hover:bg-muted/80 hover:text-zinc-600 dark:hover:bg-muted dark:hover:text-zinc-300"
              }
            `}
          >
            {t(`${train}Dropdown`)}
          </Link>
        );
      })}
    </nav>
  );
};

export default TrainSwitch;
