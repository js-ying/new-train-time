/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: "zh-TW",
    locales: ["zh-TW", "en"],
    // 關閉 Accept-Language 自動重導。避免 Google OAuth 驗證器以英文 locale 打「/」時
    // 被 307 重導至「/en」而讀到空 body
    localeDetection: false,
  },
  // 在開發環境下，每次頁面渲染時重新讀取翻譯檔案
  reloadOnPrerender: process.env.NODE_ENV === "development",
};
