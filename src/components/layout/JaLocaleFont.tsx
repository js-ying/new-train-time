import { appSans } from "@/configs/fonts";
import { Noto_Sans_JP } from "next/font/google";
import { FC } from "react";

/**
 * 日文介面的 CJK 主字體（設定同 appSans）：漢字依日本字形。
 * 僅由 _app 以 next/dynamic 在日文語系載入，字體 CSS 不進其他語系的頁面。
 */
const font = Noto_Sans_JP({
  weight: ["500", "700"],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});

/** 以 Noto_Sans_JP 為主字體，繁中字體接在後面當後備 */
const JaLocaleFont: FC = () => (
  <style jsx global>{`
    html:lang(ja) {
      --font-app-sans: ${font.style.fontFamily}, ${appSans.style.fontFamily};
    }
  `}</style>
);

export default JaLocaleFont;
