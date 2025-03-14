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
          100: "#E3F3FC",
          200: "#C8E5F9",
          300: "#A7CDED",
          400: "#8AB3DB",
          500: "#6490C4",
          600: "#4970A8",
          700: "#32538D",
          800: "#1F3A71",
          900: "#13275E",
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
              DEFAULT: "#6490C4",
              foreground: "#000000",
            },
            focus: "#6490C4",
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
