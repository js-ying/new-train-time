import { useTranslation } from "next-i18next";
import { FC } from "react";
import { JsyThsrGeneralTimetable } from "../../../models/jsy-thsr-info";
import { getNameLangKey } from "../../../utils/LocaleUtils";
import { getThsrGeneralTrainInfo } from "../../../utils/TrainInfoUtils";

type LangKey = "zhTw" | "en";

const getServiceDaysMsg = (
  langKey: LangKey,
  data?: JsyThsrGeneralTimetable["serviceDay"],
): string => {
  if (!data) return "";

  const serviceDaysArray: string[] = [];

  const dayMap: Record<keyof typeof data, Record<LangKey, string>> = {
    monday: { zhTw: "一", en: "Monday" },
    tuesday: { zhTw: "二", en: "Tuesday" },
    wednesday: { zhTw: "三", en: "Wednesday" },
    thursday: { zhTw: "四", en: "Thursday" },
    friday: { zhTw: "五", en: "Friday" },
    saturday: { zhTw: "六", en: "Saturday" },
    sunday: { zhTw: "日", en: "Sunday" },
  };

  (Object.entries(data) as [keyof typeof data, number][]).forEach(
    ([day, value]) => {
      if (value === 1) {
        serviceDaysArray.push(dayMap[day][langKey]);
      }
    },
  );

  const operatesDailyMsg: Record<LangKey, string> = {
    zhTw: "每日行駛。",
    en: "Operates daily.",
  };

  const operatesDayMsg: Record<LangKey, string> = {
    zhTw: "星期%s行駛。",
    en: "Operates on %s.",
  };

  const comma: Record<LangKey, string> = {
    zhTw: "、",
    en: ", ",
  };

  if (serviceDaysArray.length === 7) {
    return operatesDailyMsg[langKey];
  } else {
    return operatesDayMsg[langKey].replace(
      "%s",
      serviceDaysArray.join(comma[langKey]),
    );
  }
};

interface ThsrServiceDayProps {
  trainNo: string;
  generalTimeTable: JsyThsrGeneralTimetable[];
}

const ThsrServiceDay: FC<ThsrServiceDayProps> = ({
  trainNo,
  generalTimeTable,
}) => {
  const { i18n } = useTranslation();
  const serviceDay = getThsrGeneralTrainInfo(
    generalTimeTable,
    trainNo,
  )?.serviceDay;
  return (
    <div>{getServiceDaysMsg(getNameLangKey(i18n.language), serviceDay)}</div>
  );
};

export default ThsrServiceDay;
