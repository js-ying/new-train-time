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
      <div className="text-sm text-muted-foreground">
        {durationText}
      </div>
    </>
  );
};

export default ThsrTimeInfoMidArea;
