import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // by eva.design
        eerieBlack: {
          100: "#EAF1F4",
          200: "#D7E3E9",
          300: "#A8B5BE",
          400: "#6C767E",
          500: "#212529",
          600: "#181D23",
          700: "#10151D",
          800: "#0A0F17",
          900: "#060A13",
        },
        silverLakeBlue: {
          100: "#DCF0FC",
          200: "#BBE0F9",
          300: "#95C6EE",
          400: "#76AADE",
          500: "#4c85c9",
          600: "#3767AC",
          700: "#264D90",
          800: "#183574",
          900: "#0E2460",
        },
        gamboge: {
          100: "#FEF3CD",
          200: "#FEE49C",
          300: "#FCD16B",
          400: "#F9BD46",
          500: "#f59e0b",
          600: "#D27F08",
          700: "#B06305",
          800: "#8E4A03",
          900: "#753902",
        },
      },
    },
    fontFamily: {
      body: [
        "-apple-system",
        "BlinkMacSystemFont",
        "PingFang TC",
        "Roboto",
        "Microsoft YaHei",
        "Arial",
        "sans-serif",
      ],
    },
  },
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            background: "#ffffff",
            primary: {
              DEFAULT: "#4c85c9",
              foreground: "#000000",
            },
            focus: "#4c85c9",
          },
        },
        dark: {
          colors: {
            background: "#212529",
            primary: {
              DEFAULT: "#f59e0b",
              foreground: "#000000",
            },
            focus: "#f59e0b",
          },
        },
      },
    }),
  ],
  darkMode: "class",
};
