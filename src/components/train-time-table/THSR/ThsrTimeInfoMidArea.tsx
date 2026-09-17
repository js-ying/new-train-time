import { useTranslation } from "next-i18next";
import { FC } from "react";

interface ThsrTimeInfoMidAreaProps {
  timeRange: string;
  durationText: string;
  /** 是否為隔日午夜後上車 */
  isNextDay: boolean;
}

const ThsrTimeInfoMidArea: FC<ThsrTimeInfoMidAreaProps> = ({
  timeRange,
  durationText,
  isNextDay,
}) => {
  const { t } = useTranslation();

  return (
    <>
      {/* 獨立一行疊在時程上方，避免撐寬中欄擠壓右欄 */}
      {isNextDay && (
        <div>
          <span className="rounded bg-amber-100 px-1 text-xs text-amber-600 dark:bg-amber-600/40 dark:text-amber-300">
            {t("thsrNextDayBadge")}
          </span>
        </div>
      )}
      <div>{timeRange}</div>
      <div className="text-sm text-muted-foreground">
        {durationText}
      </div>
    </>
  );
};

export default ThsrTimeInfoMidArea;
