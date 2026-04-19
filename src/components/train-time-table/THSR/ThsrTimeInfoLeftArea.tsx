import { useTranslation } from "next-i18next";
import { FC } from "react";
import { JsyThsrTimetable } from "../../../models/jsy-thsr-info";
import { getNameLangKey } from "../../../utils/LocaleUtils";

interface ThsrTimeInfoLeftAreaProps {
  data: JsyThsrTimetable;
}

const ThsrTimeInfoLeftArea: FC<ThsrTimeInfoLeftAreaProps> = ({ data }) => {
  const { i18n } = useTranslation();
  const langKey = getNameLangKey(i18n.language);

  return (
    <div className="gap-1.3 flex flex-col text-sm">
      {/* 車號 */}
      <div>{data.trainInfo.trainNo}</div>

      {/* 起迄站 */}
      <div>
        {data.trainInfo.startingStationName[langKey]} -{" "}
        {data.trainInfo.endingStationName[langKey]}
      </div>
    </div>
  );
};

export default ThsrTimeInfoLeftArea;
