import { useTranslation } from "next-i18next";
import { getTdxLang } from "../../../utils/locale-utils";

const getServiceDaysMsg = (lang: string, data?): string => {
  if (!data) return "";

  // { "Monday": 1, "Tuesday": 1, "Wednesday": 1, "Thursday": 1, "Friday": 1, "Saturday": 1, "Sunday": 1 }
  const serviceDaysArray: string[] = [];

  const dayMap: Record<
    string,
    {
      Zh_tw: string;
      En: string;
    }
  > = {
    Monday: {
      Zh_tw: "一",
      En: "Monday",
    },
    Tuesday: {
      Zh_tw: "二",
      En: "Tuesday",
    },
    Wednesday: {
      Zh_tw: "三",
      En: "Wednesday",
    },
    Thursday: {
      Zh_tw: "四",
      En: "Thursday",
    },
    Friday: {
      Zh_tw: "五",
      En: "Friday",
    },
    Saturday: {
      Zh_tw: "六",
      En: "Saturday",
    },
    Sunday: {
      Zh_tw: "日",
      En: "Sunday",
    },
  };

  Object.entries(data).forEach((day: [string, number]) => {
    if (day[1] === 1) {
      serviceDaysArray.push(dayMap[day[0]][lang]);
    }
  });

  const operatesDailyMsg = {
    Zh_tw: "每日行駛。",
    En: "Operates daily.",
  };

  const operatesDayMsg = {
    Zh_tw: "星期%s行駛。",
    En: "Operates on %s.",
  };

  const comma = {
    Zh_tw: "、",
    En: ", ",
  };

  if (serviceDaysArray.length === 7) {
    return operatesDailyMsg[lang];
  } else {
    return operatesDayMsg[lang].replace(
      "%s",
      serviceDaysArray.join(comma[lang]),
    );
  }
};

const getGeneralTrainInfo = (generalTimeTable: any[], trainNo?: string) => {
  if (!trainNo) return null;

  if (generalTimeTable.length > 0) {
    return generalTimeTable.find((gtt) => {
      return gtt.GeneralTimetable.GeneralTrainInfo.TrainNo === trainNo;
    })?.GeneralTimetable;
  }

  return null;
};

const ThsrServiceDay = ({
  trainNo,
  generalTimeTable,
}: {
  trainNo: string;
  generalTimeTable: any[];
}) => {
  const { i18n } = useTranslation();
  const serviceDay = getGeneralTrainInfo(generalTimeTable, trainNo)?.ServiceDay;
  return <div>{getServiceDaysMsg(getTdxLang(i18n.language), serviceDay)}</div>;
};

export default ThsrServiceDay;
