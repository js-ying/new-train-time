/**
 * 亮/暗模式 hex 常數：給無法吃 CSS variable 的出口（meta tag、MUI theme）使用。
 * 值須與 global.scss semantic token、tailwind.config.js HeroUI theme 保持一致。
 */

/** PWA 工具列主題色（<meta name="theme-color">）；dark 對應 eerieBlack-500 */
export const PWA_THEME_COLOR = {
  light: "#FFFFFF",
  dark: "#212529",
} as const;

/** 全站主色：亮 silverLakeBlue-500 / 暗 gamboge-500 */
export const BRAND_PRIMARY_HEX = {
  light: "#4c85c9",
  dark: "#f59e0b",
} as const;
