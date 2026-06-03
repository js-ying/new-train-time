const { i18n } = require("./next-i18next.config");

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

module.exports = withPWA({
  i18n,
  // 小寫鐵路路徑（外部連結 / 使用者手打 /tymc /thsr）做 308 永久導向到 PascalCase 正解。
  // Next Pages Router 路由大小寫敏感，/tymc 會 404；source 比對亦大小寫敏感，故正確的
  // /TYMC 不會落入此規則造成迴圈。i18n 預設會自動處理各 locale 前綴（/en/tymc 一併涵蓋）。
  async redirects() {
    return [
      { source: "/tymc", destination: "/TYMC", permanent: true },
      { source: "/tymc/:path*", destination: "/TYMC/:path*", permanent: true },
      { source: "/thsr", destination: "/THSR", permanent: true },
      { source: "/thsr/:path*", destination: "/THSR/:path*", permanent: true },
    ];
  },
  // Next 14 內建：只把實際 import 到的子模組打進 client bundle，
  // 對 barrel export（@heroui/react）效果最顯著；MUI 已多用路徑式 import，
  // 加進來主要是把仍有 barrel import 的子模組（@mui/x-date-pickers）一併最佳化。
  experimental: {
    optimizePackageImports: [
      "@heroui/react",
      "@mui/material",
      "@mui/x-date-pickers",
      "@mui/icons-material",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jsy.tw",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "jsying1994.s3.us-east-1.amazonaws.com",
      },
    ],
  },
});
