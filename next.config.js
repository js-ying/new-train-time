const { i18n } = require("./next-i18next.config");

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
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
