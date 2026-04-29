import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isBetween from "dayjs/plugin/isBetween";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import { DaySegmentEnum } from "../enums/DateEnum";
import { PageEnum } from "../enums/PageEnum";

// 啟用時區、自訂解析、區間判斷等 plugin；統一以 Asia/Taipei 為預設時區，
// 避免使用者瀏覽器在非台灣時區（例如日本 UTC+9）時把「列車時間」誤解成本地時區。
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.extend(isBetween);
dayjs.tz.setDefault("Asia/Taipei");

const TZ = "Asia/Taipei";

const DateUtils = {
  getCurrentDate: (): string => {
    return dayjs().tz(TZ).format("YYYY-MM-DD");
  },
  getCurrentTime: (): string => {
    return dayjs().tz(TZ).format("HH:mm");
  },
  getCurrentDatetime: (): string => {
    return dayjs().tz(TZ).format("YYYY-MM-DD HH:mm:ss");
  },
  addMonth: (date: string, months: number): string => {
    return dayjs(date).add(months, "month").format("YYYY-MM-DD");
  },
  addDays: (date: string, days: number): string => {
    return dayjs(date).add(days, "day").format("YYYY-MM-DD");
  },
  isBefore: (date1: string, date2: string): boolean => {
    return dayjs(date1).isBefore(dayjs(date2));
  },
  isAfter: (date1: string, date2: string): boolean => {
    return dayjs(date1).isAfter(dayjs(date2));
  },
  isWithinMinutes: (datetimeA: string, datetimeB: string, minutes: number) => {
    const a = dayjs(datetimeA);
    const b = dayjs(datetimeB);
    // 判斷 A 是否在 [B - minutes, B] 區間內（含端點）
    return a.isBetween(b.subtract(minutes, "minute"), b, null, "[]");
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
    return dayjs(date).format(formatter);
  },
  isValid: (date: string) => {
    return dayjs(date).isValid();
  },
  getMaxDays: (page: PageEnum): number => {
    if (page === PageEnum.THSR) return 180;
    return 58;
  },
};

export default DateUtils;
