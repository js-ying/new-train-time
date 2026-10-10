import { baseUrl } from "@/configs/seoConfig";
import { localeToHreflang } from "@/utils/HreflangUtils";
import { getOgLocale } from "@/utils/LocaleUtils";

/**
 * 依頁面路徑（不含語系前綴，可含 query）產生自指網址、各語系替代連結（含指向預設語系的 x-default）
 * 與 og:locale:alternate；next-seo 以 property 去重，故每個語系各給 keyOverride。
 */
export const buildLocaleSeoLinks = (
  path: string,
  locale: string,
  locales: readonly string[],
  defaultLocale: string,
) => {
  const prefix = (loc: string) => (loc === defaultLocale ? "" : `/${loc}`);

  return {
    selfUrl: `${baseUrl}${prefix(locale)}${path}`,
    languageAlternates: [
      ...locales.map((loc) => ({
        hrefLang: localeToHreflang(loc),
        href: `${baseUrl}${prefix(loc)}${path}`,
      })),
      { hrefLang: "x-default", href: `${baseUrl}${path}` },
    ],
    ogAlternateMetaTags: locales
      .filter((loc) => loc !== locale)
      .map((loc) => ({
        property: "og:locale:alternate",
        content: getOgLocale(loc),
        keyOverride: `og:locale:alternate:${loc}`,
      })),
  };
};
