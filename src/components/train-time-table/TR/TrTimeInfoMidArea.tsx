import { FC } from "react";
import { JsyTrDelay } from "../../../models/jsy-tr-info";
import TrDelay from "./TrDelay";

interface TrTimeInfoMidAreaProps {
  timeRange: string;
  durationText: string;
  delayInfo: JsyTrDelay[];
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
