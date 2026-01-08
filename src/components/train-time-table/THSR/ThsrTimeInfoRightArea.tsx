import { FC } from "react";
import { JsyTimeTable } from "../../../models/jsy-thsr-info";
import ThsrAvailableSeatStatus from "./ThsrAvailableSeatStatus";

interface ThsrTimeInfoRightAreaProps {
  data: JsyTimeTable;
}

const ThsrTimeInfoRightArea: FC<ThsrTimeInfoRightAreaProps> = ({ data }) => {
  return (
    <div className="my-2 flex justify-center text-xs text-zinc-500 dark:text-zinc-400">
      <ThsrAvailableSeatStatus timeTable={data} />
    </div>
  );
};

export default ThsrTimeInfoRightArea;
