import {
  ThsrGeneralTimeTable,
  ThsrTdxGeneralTimeTable,
} from "../types/thsr-train-time-table";
import { getTdxLang } from "./LocaleUtils";

export const isTrainPass = (
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
};

/**
 * 取得 [台鐵] 山海線名稱 by Value
 * @param tripLineValue
 * @param lang
 * @returns
 */
export const getTrTripLineNameByValue = (tripLineValue, lang) => {
  if (!tripLineValue) return null;

  const tripLines = {
    0: {
      Zh_tw: "",
      En: "",
    },
    1: {
      Zh_tw: "山線",
      En: "Mountain",
    },
    2: {
      Zh_tw: "海線",
      En: "Sea",
    },
    3: {
      Zh_tw: "成追線",
      En: "Chengzhui",
    },
  };

  return tripLines[tripLineValue]?.[getTdxLang(lang)] || "";
};

/**
 * 取得 [台鐵] 車種名稱 by Code
 * @param trainTypeCode
 * @param lang
 * @returns
 */
export const getTrTrainTypeNameByCode = (trainTypeCode, lang): string => {
  if (!trainTypeCode) return null;

  const trTrainTypes = {
    "1": {
      Zh_tw: "太魯閣",
      En: "TAROKO",
    },
    "2": {
      Zh_tw: "普悠瑪",
      En: "PUYUMA",
    },
    "3": {
      Zh_tw: "自強",
      En: "TZE CHIANG",
    },
    "4": {
      Zh_tw: "莒光",
      En: "CHU KUANG",
    },
    "5": {
      Zh_tw: "復興",
      En: "FU HSING",
    },
    "6": {
      Zh_tw: "區間",
      En: "LOCAL",
    },
    "7": {
      Zh_tw: "普快",
      En: "ORDINARY",
    },
    "10": {
      Zh_tw: "區間快",
      En: "FAST LOCAL",
    },
    "11": {
      Zh_tw: "新自強",
      En: "TZE CHIANG",
    },
  };

  return trTrainTypes[trainTypeCode]?.[getTdxLang(lang)] || "";
};

/**
 * 取得列車行駛時間
 * @param startTime HH:mm
 * @param endTime HH:mm
 * @param searchAreaDate YYYY-MM-DD
 * @param lang
 * @returns
 */
export const getTimeDiff = (
  startTime: string,
  endTime: string,
  searchAreaDate: string,
): { hour: string; min: string } => {
  let endDate = searchAreaDate;
  if (endTime < startTime) {
    let date = new Date(searchAreaDate);
    const datePlusOneDate = new Date(date.setDate(date.getDate() + 1));
    endDate = new Date(
      datePlusOneDate.getTime() - datePlusOneDate.getTimezoneOffset() * 60000,
    )
      .toISOString()
      .substring(0, 10);
  }

  let date1 = new Date(searchAreaDate + "T" + startTime); // 開始時間
  let date2 = new Date(endDate + "T" + endTime); // 結束時間
  let date3 = date2.getTime() - date1.getTime(); // 時間差的毫秒數

  // 計算出小時數
  let leave1 = date3 % (24 * 3600 * 1000); // 計算天數後剩餘的毫秒數
  let hours = Math.floor(leave1 / (3600 * 1000));

  // 計算相差分鐘數
  let leave2 = leave1 % (3600 * 1000); // 計算小時數後剩餘的毫秒數
  let minutes = Math.floor(leave2 / (60 * 1000));

  return {
    hour: hours.toString(),
    min: minutes.toString(),
  };
};

/**
 * 取得高鐵列車資訊 by 定期時刻表
 * @param generalTimeTable
 * @param trainNo
 * @returns
 */
export const getThsrGeneralTrainInfo = (
  generalTimeTable: ThsrTdxGeneralTimeTable[],
  trainNo?: string,
): ThsrGeneralTimeTable | null => {
  if (!trainNo) return null;

  if (generalTimeTable.length > 0) {
    return generalTimeTable.find((gtt) => {
      return gtt.GeneralTimetable.GeneralTrainInfo.TrainNo === trainNo;
    })?.GeneralTimetable;
  }

  return null;
};
