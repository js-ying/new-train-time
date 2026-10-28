/** 公車路線鍵盤的詞彙鍵；`dotClass` 為色系鍵的色點底色。 */
export interface BusKeypadWordKey {
  label: string;
  dotClass?: string;
}

/** 色系（彩虹序），排在數字鍵左側 */
export const BUS_KEYPAD_COLOR_KEYS: BusKeypadWordKey[] = [
  { label: "紅", dotClass: "bg-red-500" },
  { label: "橘", dotClass: "bg-orange-500" },
  { label: "黃", dotClass: "bg-yellow-400" },
  { label: "綠", dotClass: "bg-green-500" },
  { label: "藍", dotClass: "bg-blue-500" },
  { label: "棕", dotClass: "bg-amber-800" },
];

/** 字母鍵，單列不捲動 */
export const BUS_KEYPAD_LETTER_KEYS: BusKeypadWordKey[] = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "H",
  "L",
  "R",
  "T",
].map((label) => ({ label }));

/** 開頭詞（依命中數） */
const PREFIX_KEYS: BusKeypadWordKey[] = [
  "小",
  "幸福",
  "通勤",
  "快",
  "內科",
  "市民",
  "觀光",
  "先導",
  "南軟",
  "懷恩",
  "貓空",
].map((label) => ({ label }));

/** 結尾詞（依命中數） */
const SUFFIX_KEYS: BusKeypadWordKey[] = [
  "區",
  "繞",
  "幹線",
  "副",
  "延",
  "專車",
  "跳蛙",
  "假日",
  "夜",
].map((label) => ({ label }));

/** 詞彙列（開頭詞、結尾詞兩組同列橫捲）；鍵帽是路線名片段（資料），各語系一律顯示中文。 */
export const BUS_KEYPAD_WORD_GROUPS: BusKeypadWordKey[][] = [
  PREFIX_KEYS,
  SUFFIX_KEYS,
];

/** 數字鍵 1–9；第四列（其他 / 清除 / 0 / 退格）由元件另行渲染 */
export const BUS_KEYPAD_DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
