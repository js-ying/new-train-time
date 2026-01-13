import { FC } from "react";

interface ThsrTimeInfoMidAreaProps {
  timeRange: string;
  durationText: string;
}

const ThsrTimeInfoMidArea: FC<ThsrTimeInfoMidAreaProps> = ({
  timeRange,
  durationText,
}) => {
  return (
    <>
      <div>{timeRange}</div>
      <div className="text-sm text-zinc-500 dark:text-zinc-400">
        {durationText}
      </div>
    </>
  );
};

export default ThsrTimeInfoMidArea;
