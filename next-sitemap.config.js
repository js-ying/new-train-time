/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://traintime.jsy.tw",
  generateRobotsTxt: true,
  // 排除不需要被索引的路徑
  exclude: ["/api/*", "/jsy.tw/*"],
  // 設定 robots.txt 的內容
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/jsy.tw/*", "/api/*"],
      },
    ],
  },
  // 新增熱門起訖站組合到 Sitemap，提升工具型網站的 SEO 覆蓋率
  additionalPaths: async () => {
    const paths = [];

    // 定義熱門路線 (起點 ID, 終點 ID, 交通工具類型) - 基於真實 GA4 數據
    const popularRoutes = [
      // 台鐵 (TR) - 高流量通勤與長途路線
      { s: "1000", e: "1080", type: "" }, // 臺北 - 桃園
      { s: "1080", e: "1000", type: "" }, // 桃園 - 臺北
      { s: "4220", e: "4400", type: "" }, // 臺南 - 高雄
      { s: "4400", e: "4220", type: "" }, // 高雄 - 臺南
      { s: "1100", e: "1000", type: "" }, // 中壢 - 臺北
      { s: "1000", e: "1100", type: "" }, // 臺北 - 中壢
      { s: "6000", e: "4400", type: "" }, // 屏東 - 高雄
      { s: "6000", e: "4340", type: "" }, // 屏東 - 新左營
      { s: "4400", e: "6000", type: "" }, // 高雄 - 屏東
      { s: "1210", e: "1000", type: "" }, // 新竹 - 臺北
      { s: "1000", e: "1210", type: "" }, // 臺北 - 新竹
      { s: "4220", e: "4340", type: "" }, // 臺南 - 新左營
      { s: "4340", e: "4220", type: "" }, // 新左營 - 臺南
      { s: "1000", e: "7000", type: "" }, // 臺北 - 花蓮
      { s: "4340", e: "6000", type: "" }, // 新左營 - 屏東
      { s: "1000", e: "0900", type: "" }, // 臺北 - 基隆
      { s: "1020", e: "1080", type: "" }, // 板橋 - 桃園
      { s: "1090", e: "1000", type: "" }, // 內壢 - 臺北
      { s: "1020", e: "1100", type: "" }, // 板橋 - 中壢
      { s: "3360", e: "3340", type: "" }, // 彰化 - 新烏日
      { s: "4220", e: "4270", type: "" }, // 臺南 - 沙崙
      { s: "3300", e: "3360", type: "" }, // 臺中 - 彰化
      { s: "3340", e: "3360", type: "" }, // 新烏日 - 彰化
      { s: "3300", e: "1000", type: "" }, // 臺中 - 臺北
      { s: "1040", e: "1000", type: "" }, // 樹林 - 臺北
      { s: "1210", e: "1250", type: "" }, // 新竹 - 竹南
      { s: "1080", e: "1020", type: "" }, // 桃園 - 板橋
      { s: "1000", e: "3300", type: "" }, // 臺北 - 臺中
      { s: "4220", e: "4080", type: "" }, // 臺南 - 嘉義
      { s: "0980", e: "1000", type: "" }, // 南港 - 臺北
      { s: "4050", e: "4220", type: "" }, // 新營 - 臺南
      { s: "7000", e: "1000", type: "" }, // 花蓮 - 臺北
      { s: "0960", e: "1000", type: "" }, // 汐止 - 臺北
      { s: "1000", e: "1040", type: "" }, // 臺北 - 樹林
      { s: "1080", e: "1100", type: "" }, // 桃園 - 中壢
      { s: "3340", e: "3300", type: "" }, // 新烏日 - 臺中
      { s: "0900", e: "1000", type: "" }, // 基隆 - 臺北
      { s: "1000", e: "5100", type: "" }, // 臺北 - 臺東
      { s: "1000", e: "0980", type: "" }, // 臺北 - 南港
      { s: "4220", e: "3300", type: "" }, // 臺南 - 臺中
      { s: "1210", e: "3300", type: "" }, // 新竹 - 臺中
      { s: "1080", e: "1210", type: "" }, // 桃園 - 新竹
      { s: "1000", e: "4220", type: "" }, // 臺北 - 臺南
      { s: "3390", e: "3300", type: "" }, // 員林 - 臺中
      { s: "1210", e: "1080", type: "" }, // 新竹 - 桃園
      { s: "1000", e: "0970", type: "" }, // 臺北 - 汐科
      { s: "4080", e: "4220", type: "" }, // 嘉義 - 臺南
      { s: "4270", e: "4220", type: "" }, // 沙崙 - 臺南
      { s: "1000", e: "1070", type: "" }, // 臺北 - 鶯歌
      { s: "1100", e: "1210", type: "" }, // 中壢 - 新竹

      // 高鐵 (THSR) - 基於真實 GA4 數據
      { s: "1030", e: "1040", type: "/THSR" }, // 新竹 - 台中
      { s: "1000", e: "1040", type: "/THSR" }, // 台北 - 台中
      { s: "1070", e: "1000", type: "/THSR" }, // 左營 - 台北
      { s: "1040", e: "1000", type: "/THSR" }, // 台中 - 台北
      { s: "1000", e: "1070", type: "/THSR" }, // 台北 - 左營
      { s: "1040", e: "1020", type: "/THSR" }, // 台中 - 桃園
      { s: "1020", e: "1070", type: "/THSR" }, // 桃園 - 左營
      { s: "1070", e: "1020", type: "/THSR" }, // 左營 - 桃園
      { s: "1000", e: "1060", type: "/THSR" }, // 台北 - 台南
      { s: "1000", e: "1050", type: "/THSR" }, // 台北 - 嘉義
      { s: "0990", e: "1070", type: "/THSR" }, // 南港 - 左營
      { s: "0990", e: "1040", type: "/THSR" }, // 南港 - 台中
      { s: "1070", e: "1040", type: "/THSR" }, // 左營 - 台中
      { s: "1000", e: "1030", type: "/THSR" }, // 台北 - 新竹
      { s: "1060", e: "1000", type: "/THSR" }, // 台南 - 台北
      { s: "1070", e: "1030", type: "/THSR" }, // 左營 - 新竹
      { s: "1030", e: "1000", type: "/THSR" }, // 新竹 - 台北
      { s: "1060", e: "1020", type: "/THSR" }, // 台南 - 桃園
      { s: "1040", e: "1070", type: "/THSR" }, // 台中 - 左營
      { s: "1070", e: "1010", type: "/THSR" }, // 左營 - 板橋
      { s: "1020", e: "1040", type: "/THSR" }, // 桃園 - 台中
      { s: "1040", e: "1010", type: "/THSR" }, // 台中 - 板橋
      { s: "1010", e: "1040", type: "/THSR" }, // 板橋 - 台中
      { s: "1070", e: "0990", type: "/THSR" }, // 左營 - 南港
      { s: "1030", e: "1070", type: "/THSR" }, // 新竹 - 左營
      { s: "1060", e: "1040", type: "/THSR" }, // 台南 - 台中
      { s: "1040", e: "1030", type: "/THSR" }, // 台中 - 新竹
      { s: "1000", e: "1020", type: "/THSR" }, // 台北 - 桃園
      { s: "1070", e: "1060", type: "/THSR" }, // 左營 - 台南
      { s: "1010", e: "1070", type: "/THSR" }, // 板橋 - 左營

      // 桃捷 (TYMC) - 基於真實 GA4 數據
      { s: "A1", e: "A13", type: "/TYMC" }, // 台北車站 - 機場第二航廈
      { s: "A1", e: "A12", type: "/TYMC" }, // 台北車站 - 機場第一航廈
      { s: "A18", e: "A12", type: "/TYMC" }, // 高鐵桃園站 - 機場第一航廈
      { s: "A18", e: "A13", type: "/TYMC" }, // 高鐵桃園站 - 機場第二航廈
      { s: "A3", e: "A13", type: "/TYMC" }, // 新北產業園區站 - 機場第二航廈
      { s: "A3", e: "A12", type: "/TYMC" }, // 新北產業園區站 - 機場第一航廈
      { s: "A13", e: "A1", type: "/TYMC" }, // 機場第二航廈 - 台北車站
      { s: "A1", e: "A8", type: "/TYMC" }, // 台北車站 - 長庚醫院站
      { s: "A2", e: "A12", type: "/TYMC" }, // 三重站 - 機場第一航廈
      { s: "A13", e: "A18", type: "/TYMC" }, // 機場第二航廈 - 高鐵桃園站
      { s: "A2", e: "A22", type: "/TYMC" }, // 三重站 - 老街溪站
      { s: "A8", e: "A1", type: "/TYMC" }, // 長庚醫院站 - 台北車站
      { s: "A12", e: "A18", type: "/TYMC" }, // 機場第一航廈 - 高鐵桃園站
      { s: "A12", e: "A1", type: "/TYMC" }, // 機場第一航廈 - 台北車站
      { s: "A21", e: "A18", type: "/TYMC" }, // 環北站 - 高鐵桃園站
      { s: "A8", e: "A18", type: "/TYMC" }, // 長庚醫院站 - 高鐵桃園站
      { s: "A1", e: "A7", type: "/TYMC" }, // 台北車站 - 體育大學站
      { s: "A1", e: "A9", type: "/TYMC" }, // 台北車站 - 林口站
      { s: "A1", e: "A18", type: "/TYMC" }, // 台北車站 - 高鐵桃園站
      { s: "A9", e: "A18", type: "/TYMC" }, // 林口站 - 高鐵桃園站
    ];

    const locales = ["", "/en"];

    locales.forEach((locale) => {
      popularRoutes.forEach((route) => {
        paths.push({
          loc: `${locale}${route.type}/search?s=${route.s}&e=${route.e}`,
          changefreq: "always",
          priority: 0.7,
        });
      });
    });

    return paths;
  },
  // 自訂每個頁面的內容
  transform: async (config, path) => {
    const siteUrl = config.siteUrl;

    // 主要頁面（台鐵、高鐵、機捷）使用較高優先度
    const mainPages = ["/", "/THSR", "/TYMC"];
    const isMainPage = mainPages.some(
      (p) =>
        path === p || path === `/en${p}` || path === `/en${p === "/" ? "" : p}`,
    );

    // 次要頁面（特色介紹、更新公告）
    const secondaryPages = ["/features", "/updates"];
    const isSecondaryPage = secondaryPages.some(
      (p) => path === p || path === `/en${p}`,
    );

    // 動態生成 alternateRefs，讓每個頁面指向正確的語言版本
    const isEnglishPath = path.startsWith("/en");
    const basePath = isEnglishPath ? path.replace(/^\/en/, "") || "/" : path;

    const alternateRefs = [
      {
        href: `${siteUrl}${basePath === "/" ? "" : basePath}`,
        hreflang: "zh-TW",
      },
      {
        href: `${siteUrl}/en${basePath === "/" ? "" : basePath}`,
        hreflang: "en",
      },
      {
        href: `${siteUrl}${basePath === "/" ? "" : basePath}`,
        hreflang: "x-default",
      },
    ];

    return {
      loc: `${siteUrl}${path === "/" ? "" : path}`, // 強制使用絕對路徑，避免 next-sitemap 自行拼接導致 alternate 異常
      changefreq: isMainPage
        ? "always"
        : isSecondaryPage
          ? "monthly"
          : "weekly",
      priority: isMainPage ? (path === "/" || path === "/en" ? 1.0 : 0.8) : 0.6,
      lastmod: new Date().toISOString(),
      alternateRefs,
    };
  },
};
