import moment from "moment-timezone";
import { DaySegmentEnum } from "../enums/DateEnum";
moment.tz.setDefault("Asia/Taipei");

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
  isWithinMinutes: (datetimeA: string, datetimeB: string, minutes) => {
    const momentA = moment(datetimeA);
    const momentB = moment(datetimeB);

    // 獲取時間 B 往前推 30 分鐘的時間
    const timeBMinus30Minutes = momentB.clone().subtract(minutes, "minutes");

    // 檢查時間 A 是否在時間 B 減去 30 分鐘的時間和時間 B 之間
    return momentA.isBetween(timeBMinus30Minutes, momentB, null, "[]");
  },
  /**
   * 取得時間 by Url 參數
   * @param urlTimeParam mmss
   * @returns mm:ss
   */
  getTimeByUrlParam: (urlTimeParam: string) => {
    if (!urlTimeParam || urlTimeParam.length !== 4) return null;

    return `${urlTimeParam.slice(0, 2)}:${urlTimeParam.slice(2, 4)}`;
  },
  /**
   * 取得 12 時制的時(字串) by AM/PM
   * @param hour
   * @param daySeg
   * @returns
   */
  getHour12ByHour24: (hour24: string | number): string => {
    if (hour24 != null && hour24 !== undefined && hour24 !== "") {
      return String(
        Number(hour24) >= 13 && Number(hour24) <= 24
          ? Number(hour24) - 12
          : Number(hour24),
      ).padStart(2, "0");
    }

    return null;
  },
  /**
   * 取得 24 時制的時(字串) by AM/PM
   * @param hour
   * @param daySeg
   * @returns
   */
  getHour24ByDaySeg: (
    hour: string | number,
    daySeg: DaySegmentEnum,
  ): string => {
    if (hour != null && hour !== undefined && hour !== "") {
      const numberHour = Number(hour);
      if (daySeg === DaySegmentEnum.AM) {
        return String(hour).padStart(2, "0");
      } else {
        return String(numberHour + 12).padStart(2, "0");
      }
    }

    return null;
  },
  getDaySeg: (hour24: string | number): DaySegmentEnum => {
    return Number(hour24) >= 13 && Number(hour24) <= 24
      ? DaySegmentEnum.PM
      : DaySegmentEnum.AM;
  },
  dateFormatter: (date: string, formatter: string) => {
    return moment(date).format(formatter);
  },
  isValid: (date: string) => {
    return moment(date).isValid();
  },
};

export default DateUtils;
