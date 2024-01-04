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
  /**
   * 取得時間
   * @param urlTimeParam mmss
   * @returns mm:ss
   */
  getTimeByUrlParam: (urlTimeParam: string) => {
    if (!urlTimeParam || urlTimeParam.length !== 4) return null;

    return `${urlTimeParam.slice(0, 2)}:${urlTimeParam.slice(2, 4)}`;
  },
  isTrainPass: (
    date: string,
    currentDate: string,
    departureTime: string,
  ): boolean => {
    // 若查詢日期與當下日期相同
    if (date === currentDate) {
      const trainDatetime = new Date(
        `${date.replace(/-/g, "/")} ${departureTime}`,
      );
      const nowDatetime = new Date();
      // 若火車時間小於當下時間則代表火車已過時
      if (trainDatetime < nowDatetime) {
        return true;
      }
    }

    return false;
  },
};

export default DateUtils;
