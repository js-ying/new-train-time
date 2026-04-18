const { i18n } = require("./next-i18next.config");

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

module.exports = withPWA({
  i18n,
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
