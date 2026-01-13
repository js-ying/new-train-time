/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: "zh-TW",
    locales: ["zh-TW", "en"],
  },
  // 在開發環境下，每次頁面渲染時重新讀取翻譯檔案
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
