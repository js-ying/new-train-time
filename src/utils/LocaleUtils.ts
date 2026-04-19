import { LocaleEnum } from "@/enums/LocaleEnum";

/**
 * 取得 Jsy 多語欄位 key (zhTw / en)
 *
 * @description 系統 locale 命名與 Jsy 多語欄位不一致，使用 mapping 表動態取對應 key
 * @returns "zhTw" | "en"
 */
export const getNameLangKey = (lang: string): "zhTw" | "en" => {
  const map: Record<string, "zhTw" | "en"> = {
    [LocaleEnum.TW]: "zhTw",
    [LocaleEnum.EN]: "en",
  };

  return map[lang] || "zhTw";
};

/**
 * 取得 TDX 風格多語欄位 key (Zh_tw / En)
 *
 * @description 限用於本地靜態車站資料 (data/stationsData.ts) 等沿用 TDX 命名的內部資料；
 * 任何來自後端 API 的 Jsy 契約資料請改用 getNameLangKey。
 */
export const getTdxLang = (lang: string): "Zh_tw" | "En" => {
  const map: Record<string, "Zh_tw" | "En"> = {
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
