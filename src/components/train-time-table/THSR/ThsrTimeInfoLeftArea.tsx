import useStationName from "@/hooks/useStationName";
import { PageEnum } from "@/enums/PageEnum";
import { FC } from "react";
import { JsyThsrTimetable } from "../../../models/jsy-thsr-info";

interface ThsrTimeInfoLeftAreaProps {
  data: JsyThsrTimetable;
}

const ThsrTimeInfoLeftArea: FC<ThsrTimeInfoLeftAreaProps> = ({ data }) => {
  const stationName = useStationName(PageEnum.THSR);

  return (
    <div className="gap-1.3 flex flex-col text-sm">
      {/* 車號 */}
      <div>{data.trainInfo.trainNo}</div>

      {/* 起迄站 */}
      <div>
        {stationName(
          data.trainInfo.startingStationId,
          data.trainInfo.startingStationName,
        )}{" "}
        -{" "}
        {stationName(
          data.trainInfo.endingStationId,
          data.trainInfo.endingStationName,
        )}
      </div>
    </div>
  );
};

export default ThsrTimeInfoLeftArea;
