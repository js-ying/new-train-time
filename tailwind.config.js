const { heroui } = require("@heroui/react");

// 包成 hsl(var(--token) / <alpha>) 讓 Tailwind 支援 bg-primary/50 等透明度語法

const withOpacity = (variable) => `hsl(var(${variable}) / <alpha-value>)`;

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
        // ── Semantic tokens：元件預設使用 ──
        background: withOpacity("--color-background"),
        foreground: withOpacity("--color-foreground"),
        primary: {
          DEFAULT: withOpacity("--color-primary"),
          foreground: withOpacity("--color-primary-foreground"),
        },
        muted: {
          DEFAULT: withOpacity("--color-muted"),
          foreground: withOpacity("--color-muted-foreground"),
        },
        accent: {
          DEFAULT: withOpacity("--color-accent"),
          foreground: withOpacity("--color-accent-foreground"),
        },
        secondary: {
          DEFAULT: withOpacity("--color-secondary"),
          foreground: withOpacity("--color-secondary-foreground"),
        },
        destructive: {
          DEFAULT: withOpacity("--color-destructive"),
          foreground: withOpacity("--color-destructive-foreground"),
        },
        border: withOpacity("--color-border"),
        input: withOpacity("--color-input"),
        ring: withOpacity("--color-ring"),

        // ── Primitive：保留色階供漸進式遷移 ──
        eerieBlack: {
          100: withOpacity("--color-eerie-black-100"),
          200: withOpacity("--color-eerie-black-200"),
          300: withOpacity("--color-eerie-black-300"),
          400: withOpacity("--color-eerie-black-400"),
          500: withOpacity("--color-eerie-black-500"),
          600: withOpacity("--color-eerie-black-600"),
          700: withOpacity("--color-eerie-black-700"),
          800: withOpacity("--color-eerie-black-800"),
          900: withOpacity("--color-eerie-black-900"),
        },
        silverLakeBlue: {
          100: withOpacity("--color-silver-lake-blue-100"),
          200: withOpacity("--color-silver-lake-blue-200"),
          300: withOpacity("--color-silver-lake-blue-300"),
          400: withOpacity("--color-silver-lake-blue-400"),
          500: withOpacity("--color-silver-lake-blue-500"),
          600: withOpacity("--color-silver-lake-blue-600"),
          700: withOpacity("--color-silver-lake-blue-700"),
          800: withOpacity("--color-silver-lake-blue-800"),
          900: withOpacity("--color-silver-lake-blue-900"),
        },
        gamboge: {
          100: withOpacity("--color-gamboge-100"),
          200: withOpacity("--color-gamboge-200"),
          300: withOpacity("--color-gamboge-300"),
          400: withOpacity("--color-gamboge-400"),
          500: withOpacity("--color-gamboge-500"),
          600: withOpacity("--color-gamboge-600"),
          700: withOpacity("--color-gamboge-700"),
          800: withOpacity("--color-gamboge-800"),
          900: withOpacity("--color-gamboge-900"),
        },
      },
      fontSize: {
        // 對應現有 text-[10px] / text-[11px] 用法
        xxs: ["0.625rem", { lineHeight: "0.875rem" }],
      },
      zIndex: {
        dropdown: "10",
        sticky: "20",
        fixed: "30",
        modal: "40",
        tooltip: "50",
        overlay: "100",
      },
      maxWidth: {
        // 對應現有 max-w-[728px] (Google Ads leaderboard)
        "ad-leaderboard": "728px",
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
        // HeroUI v2 的色值會經過 chroma 解析，不接受 var() / <alpha-value> 形式，
        // 必須給 hex 或 rgb literal，且亮/暗 theme 得各別填色（HeroUI 自己負責切換）。
        // 此處的色值需與 src/styles/global.scss 的 semantic token 在視覺上保持一致。
        light: {
          colors: {
            background: "#ffffff",
            primary: {
              DEFAULT: "#4c85c9", // silverLakeBlue-500
              foreground: "#000000",
            },
            focus: "#4c85c9",
          },
        },
        dark: {
          colors: {
            background: "#212529", // eerieBlack-500
            primary: {
              DEFAULT: "#f59e0b", // gamboge-500
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
