import { appSans } from "@/configs/fonts";
import { Noto_Sans_KR } from "next/font/google";
import { FC } from "react";

/**
 * 韓文介面的 CJK 主字體（設定同 appSans）：提供韓文字。
 * 僅由 _app 以 next/dynamic 在韓文語系載入，字體 CSS 不進其他語系的頁面。
 */
const font = Noto_Sans_KR({
  weight: ["500", "700"],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});

/** 以 Noto_Sans_KR 為主字體，繁中字體接在後面當後備 */
const KoLocaleFont: FC = () => (
  <style jsx global>{`
    html:lang(ko) {
      --font-app-sans: ${font.style.fontFamily}, ${appSans.style.fontFamily};
    }
  `}</style>
);

export default KoLocaleFont;
