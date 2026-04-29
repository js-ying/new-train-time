import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import { JsyThsrGeneralTimetable } from "@/models/jsy-thsr-info";
import { getNameLangKey } from "./LocaleUtils";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * 列車是否已發車
 *
 * 注意：列車時刻一律以「台灣時間 (Asia/Taipei, UTC+8)」為基準，
 * 不可用 `new Date("YYYY/MM/DD HH:mm")` 解析——該語法會以「使用者瀏覽器當地時區」
 * 解讀字串，導致在日本 (UTC+9) 等其他時區查詢時，08:00~09:00 之間的台灣班次
 * 會被誤判為「已發車」。改以 dayjs.tz 明確帶入 Asia/Taipei 後比較 UTC instant。
 */
export const isTrainPass = (
  date: string,
  currentDate: string,
  departureTime: string, // HH:mm
): boolean => {
  // 僅在「查詢日 = 當下日 (台北時區)」時才需要判斷
  if (date !== currentDate) return false;

  const trainInstant = dayjs
    .tz(`${date} ${departureTime}`, "YYYY-MM-DD HH:mm", "Asia/Taipei")
    .valueOf();
  const nowInstant = Date.now();

  return trainInstant < nowInstant;
};

/**
 * [台鐵] 是否可訂票
 */
export const isTrTrainOrderable = () => {};

/**
 * 取得 [台鐵] 山海線名稱 by Value
 * @param tripLineValue
 * @param lang
 * @returns
 */
export const getTrTripLineNameByValue = (tripLineValue, lang) => {
  if (!tripLineValue) return null;

  const tripLines = {
    0: { zhTw: "", en: "" },
    1: { zhTw: "山線", en: "Mountain" },
    2: { zhTw: "海線", en: "Sea" },
    3: { zhTw: "成追線", en: "Chengzhui" },
  };

  return tripLines[tripLineValue]?.[getNameLangKey(lang)] || "";
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
    "1": { zhTw: "太魯閣", en: "TAROKO" },
    "2": { zhTw: "普悠瑪", en: "PUYUMA" },
    "3": { zhTw: "自強", en: "TZE CHIANG" },
    "4": { zhTw: "莒光", en: "CHU KUANG" },
    "5": { zhTw: "復興", en: "FU HSING" },
    "6": { zhTw: "區間", en: "LOCAL" },
    "7": { zhTw: "普快", en: "ORDINARY" },
    "10": { zhTw: "區間快", en: "FAST LOCAL" },
    "11": { zhTw: "新自強", en: "TZE CHIANG" },
  };

  return trTrainTypes[trainTypeCode]?.[getNameLangKey(lang)] || "";
};

/**
 * [台鐵] 車種是否為對號列車
 */
export const isTrTrainReserved = (trainTypeCode: string): boolean => {
  return ["1", "2", "3", "4", "5", "11"].includes(trainTypeCode);
};

/**
 * [台鐵] 車種是否為非對號列車
 */
export const isTrTrainNonReserved = (trainTypeCode: string): boolean => {
  return ["6", "7", "10"].includes(trainTypeCode);
};

/**
 * [台鐵] 車種是否持票才可上車
 * 太魯閣、普悠碼、新自強、觀光列車、團體列車
 */
export const isTrTrainOnlyTicket = (trainTypeCode: string): boolean => {
  return ["1", "2", "11"].includes(trainTypeCode);
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
 * 取得 [高鐵] 列車資訊 by 定期時刻表
 * @param generalTimeTable
 * @param trainNo
 * @returns
 */
export const getThsrGeneralTrainInfo = (
  generalTimeTable: JsyThsrGeneralTimetable[],
  trainNo?: string,
): JsyThsrGeneralTimetable | null => {
  if (!trainNo) return null;

  if (generalTimeTable.length > 0) {
    return (
      generalTimeTable.find((gtt) => gtt.trainInfo.trainNo === trainNo) || null
    );
  }

  return null;
};

/**
 * [桃園捷運] 車種是否為直達車
 */
export const isTymcTrainDirect = (trainTypeCode: number): boolean => {
  return [0, 2].includes(trainTypeCode);
};

/**
 * [桃園捷運] 車種是否為普通車
 */
export const isTymcTrainNormal = (trainTypeCode: number): boolean => {
  return [0, 1].includes(trainTypeCode);
};
