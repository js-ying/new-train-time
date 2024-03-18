const { i18n } = require("./next-i18next.config");

module.exports = {
  i18n,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jsy.tw",
      },
    ],
  },
};
