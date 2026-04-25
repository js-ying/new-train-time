/**
 * 把 next-i18next 的內部 locale 轉換為對外 hreflang 標籤值。
 *
 * 內部 locale 為 routing 用（next.config 的 i18n.locales），與 SEO 需要對外輸出的
 * hreflang 不同。Google 自 2023 起建議使用 ISO 15924 script code 標示中文書寫系統，
 * 故 zh-TW（地區碼）對外輸出為 zh-Hant（書寫系統碼）。
 */
export const localeToHreflang = (locale: string): string => {
  if (locale === "zh-TW") return "zh-Hant";
  if (locale === "x-default") return "x-default";
  return locale;
};
