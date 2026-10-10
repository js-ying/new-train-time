import { LocaleEnum } from "@/enums/LocaleEnum";

/**
 * 取得 Jsy 多語欄位 key (zhTw / en)
 *
 * @description 系統 locale 命名與 Jsy 多語欄位不一致，使用 mapping 表動態取對應 key；
 * Jsy 名稱只有中英，日文取中文、韓文取英文
 * @returns "zhTw" | "en"
 */
export const getNameLangKey = (lang: string): "zhTw" | "en" => {
  const map: Record<string, "zhTw" | "en"> = {
    [LocaleEnum.TW]: "zhTw",
    [LocaleEnum.EN]: "en",
    [LocaleEnum.JA]: "zhTw",
    [LocaleEnum.KO]: "en",
  };

  return map[lang] || "zhTw";
};

/**
 * 取得 TDX 風格多語欄位 key (Zh_tw / En / Ja / Ko)
 *
 * @description 限用於本地靜態車站資料 (data/stationsData.ts) 等沿用 TDX 命名的內部資料；
 * 任何來自後端 API 的 Jsy 契約資料請改用 getNameLangKey。
 */
export const getTdxLang = (lang: string): "Zh_tw" | "En" | "Ja" | "Ko" => {
  const map: Record<string, "Zh_tw" | "En" | "Ja" | "Ko"> = {
    [LocaleEnum.TW]: "Zh_tw",
    [LocaleEnum.EN]: "En",
    [LocaleEnum.JA]: "Ja",
    [LocaleEnum.KO]: "Ko",
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
    [LocaleEnum.JA]: "ja_JP",
    [LocaleEnum.KO]: "ko_KR",
  };

  return map[locale] || "zh_TW";
};

/** 各語系在選單上的名稱（以該語言本身書寫） */
export const LOCALE_LABELS: Record<LocaleEnum, string> = {
  [LocaleEnum.TW]: "繁體中文",
  [LocaleEnum.EN]: "English",
  [LocaleEnum.JA]: "日本語",
  [LocaleEnum.KO]: "한국어",
};

/** 全站支援的語系（選單顯示順序） */
export const ALL_LOCALES: readonly LocaleEnum[] = [
  LocaleEnum.TW,
  LocaleEnum.EN,
  LocaleEnum.JA,
  LocaleEnum.KO,
];
