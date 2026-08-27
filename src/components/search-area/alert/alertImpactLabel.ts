/** 公告標題關鍵字 → 按鈕文案 i18n key（三鐵 OperationAlert 與公車 BusOperationAlert 共用），由上而下依優先序比對 */
const ALERT_IMPACT_RULES: { keywords: string[]; i18n: string }[] = [
  { keywords: ["颱風"], i18n: "typhoonImpact" },
  { keywords: ["地震"], i18n: "earthquakeImpact" },
  // 「大雨」同時涵蓋「豪大雨」，「豪雨」則涵蓋「豪雨特報」等不含「大雨」的寫法
  { keywords: ["豪雨", "大雨"], i18n: "heavyRainImpact" },
];

/** 依公告標題挑按鈕文案；皆未命中時回傳狀態預設文案 */
export const resolveAlertImpactI18n = (
  titles: string[],
  fallbackI18n: string,
): string =>
  ALERT_IMPACT_RULES.find((rule) =>
    titles.some((title) => rule.keywords.some((kw) => title.includes(kw))),
  )?.i18n ?? fallbackI18n;
