const { i18n } = require("./next-i18next.config");

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
})

module.exports = withPWA({
  i18n,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jsy.tw",
      },
    ],
  },
});
