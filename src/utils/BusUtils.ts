import { JsyBusRoute } from "@/models/jsy-bus-info";

/** 路線來源 → i18n key（市區公車另以縣市名取代）。 */
export const SOURCE_LABEL_KEY: Record<JsyBusRoute["source"], string> = {
  city: "busSourceCity",
  intercity: "busSourceIntercity",
  taiwantrip: "busSourceTaiwanTrip",
};

/** TDX 縣市三碼（公路客運 / 台灣好行站牌的 LocationCityCode）→ busCity i18n key */
const CITY_CODE_TO_BUS_CITY: Record<string, string> = {
  TPE: "Taipei",
  NWT: "NewTaipei",
  TAO: "Taoyuan",
  TXG: "Taichung",
  TNN: "Tainan",
  KHH: "Kaohsiung",
  KEE: "Keelung",
  HSZ: "Hsinchu",
  HSQ: "HsinchuCounty",
  MIA: "MiaoliCounty",
  CHA: "ChanghuaCounty",
  NAN: "NantouCounty",
  YUN: "YunlinCounty",
  CYI: "Chiayi",
  CYQ: "ChiayiCounty",
  PIF: "PingtungCounty",
  ILA: "YilanCounty",
  HUA: "HualienCounty",
  TTT: "TaitungCounty",
  PEN: "PenghuCounty",
  KIN: "KinmenCounty",
  LIE: "LienchiangCounty",
};

/** 縣市碼統一成 busCity key：市區公車碼原樣、三碼轉換、未知原樣回傳 */
export const toBusCityKey = (code: string): string =>
  CITY_CODE_TO_BUS_CITY[code] ?? code;
