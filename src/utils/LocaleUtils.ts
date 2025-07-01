import { LocaleEnum } from "@/enums/LocaleEnum";

/**
 * 取得 TDX 語系
 *
 * @description 系統 locale 命名與 TDX 不一致，所以需使用這個 mapping 表動態切換多語系
 * @returns string
 */
export const getTdxLang = (lang: string) => {
  const map = {
    [LocaleEnum.TW]: "Zh_tw",
    [LocaleEnum.EN]: "En",
  };

  return map[lang] || "Zh_tw";
};

/**
 * 取得 OG 語系
 *
 * @param lang
 * @returns string
 */
export const getOgLocale = (locale: LocaleEnum | string): string => {
  const map = {
    [LocaleEnum.TW]: "zh_TW",
    [LocaleEnum.EN]: "en_US",
  };

  return map[locale] || "zh_TW";
};
