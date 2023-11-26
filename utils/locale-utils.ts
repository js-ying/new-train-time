import { useTranslation } from "next-i18next";

/**
 * 取得 TDX 語言
 *
 * @description 系統 locale 命名與 TDX 不一致，所以需使用這個 mapping 表動態切換多語系
 * @returns string
 */
export const GetTdxLang = () => {
  const { i18n } = useTranslation();
  const map = {
    "zh-Hant": "Zh_tw",
    en: "En",
  };

  return map[i18n.language] || "Zh_tw";
};
