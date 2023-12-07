import moment from "moment-timezone";
moment().tz("Asia/Taipei");

const DateUtils = {
  getCurrentDate: (): string => {
    return moment().format("YYYY-MM-DD");
  },
  getCurrentTime: (): string => {
    return moment().format("HH:mm");
  },
  getCurrentDatetime: (): string => {
    return moment().format("YYYY-MM-DD HH:mm:ss");
  },
  addMonth: (date: string, months: number): string => {
    return moment(date).add(months, "month").format("YYYY-MM-DD");
  },
  isBefore: (date1: string, date2: string): boolean => {
    return moment(date1).isBefore(date2);
  },
  isAfter: (date1: string, date2: string): boolean => {
    return moment(date1).isAfter(date2);
  },
  getTimeByUrlParam: (urlTimeParam: string) => {
    if (!urlTimeParam || urlTimeParam.length !== 4) return null;

    return `${urlTimeParam.slice(0, 2)}:${urlTimeParam.slice(2, 4)}`;
  },
};

export default DateUtils;
