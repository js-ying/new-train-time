export enum LocaleEnum {
  TW = "zh-Hant",
  EN = "en",
}

export const baseUrl = "https://traintime.jsy.tw";

export const localeUrlList = [
  { locale: LocaleEnum.TW, url: baseUrl + "" },
  { locale: LocaleEnum.EN, url: baseUrl + "/en" },
];
