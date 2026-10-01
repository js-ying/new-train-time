import { FC } from "react";
import NextDayBadge from "../NextDayBadge";

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
  return (
    <>
      {isNextDay && <NextDayBadge />}
      <div>{timeRange}</div>
      <div className="text-sm text-muted-foreground">
        {durationText}
      </div>
    </>
  );
};

export default ThsrTimeInfoMidArea;
