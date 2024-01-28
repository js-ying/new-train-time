import { useTranslation } from "next-i18next";
import { ThsrDailyTimetable } from "../../../types/thsr-train-time-table";
import { getTdxLang } from "../../../utils/locale-utils";

const ThsrTimeInfoLeftArea = ({ data }: { data: ThsrDailyTimetable }) => {
  const { i18n } = useTranslation();

  return (
    <div className="gap-1.3 flex flex-col text-sm">
      {/* 車號 */}
      <div>{data.DailyTrainInfo.TrainNo}</div>

      {/* 起迄站 */}
      <div>
        {data.DailyTrainInfo.StartingStationName[getTdxLang(i18n.language)]} -{" "}
        {data.DailyTrainInfo.EndingStationName[getTdxLang(i18n.language)]}
      </div>
    </div>
  );
};

export default ThsrTimeInfoLeftArea;
