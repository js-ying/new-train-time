import { FC } from "react";
import TrDelay from "./TrDelay";

interface TrTimeInfoMidAreaProps {
  timeRange: string;
  durationText: string;
  delayInfo: any[]; // Or appropriate type from your model
}

const TrTimeInfoMidArea: FC<TrTimeInfoMidAreaProps> = ({
  timeRange,
  durationText,
  delayInfo,
}) => {
  return (
    <>
      <TrDelay dataList={delayInfo} />
      <div>{timeRange}</div>
      <div className="text-sm text-zinc-500 dark:text-zinc-400">
        {durationText}
      </div>
    </>
  );
};

export default TrTimeInfoMidArea;
