const { i18n } = require("./next-i18next.config");

// next-pwa 預設的 runtimeCaching：其中 cacheName 'apis' 會把 /api/* 的 GET 以
// NetworkFirst 快取（僅排除 /api/auth/）。/api/users/*、/api/payments/* 帶 PII /
// 權限 / 金流，被快取後離線或逾時回退會命中前一帳號的 /me，造成跨帳號殘留與降級延遲。
const defaultRuntimeCaching = require("next-pwa/cache");
const runtimeCaching = [
  {
    // 敏感端點一律 NetworkOnly（永不寫 SW cache）；置於預設陣列之前，
    // Workbox 採註冊順序、首個命中者勝出，故會先於 'apis' 的 NetworkFirst 命中。
    urlPattern: ({ url }) =>
      self.origin === url.origin &&
      /^\/api\/(users|payments)\//.test(url.pathname),
    handler: "NetworkOnly",
  },
  ...defaultRuntimeCaching,
];

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  runtimeCaching,
});

module.exports = withPWA({
  i18n,
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
