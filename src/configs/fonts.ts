import { Inter, Noto_Sans_TC } from "next/font/google";

/**
 * 西文與數字字體：Inter（自架，固定字重）。
 *
 * 動機：Noto Sans TC 本身雖含拉丁字形，但其英數觀感不佳（尤其時刻表大量數字）；
 * 而「直接吃 macOS 原生 SF」又會重新引入 iOS『粗體文字』綁架與跨 OS 換字的字重不一致。
 * 折衷：改用自架的 Inter（觀感接近 SF Pro 的 UI 字體）只負責英數，
 * 既比 Noto 的拉丁好看，又因是固定字重的 web font 而非系統字，全平台字重一致。
 *
 * 為何不需要 unicode-range：Inter 完全不含 CJK 字符（含全形標點），
 * 靠字體堆疊「逐字回退」即可——英數命中 Inter，中文無字符自然落到 appSans（Noto）。
 * 且 Inter 不是系統字，沒有 `-apple-system` 在 Safari 觸發系統 CJK fallback（PingFang）的坑。
 *
 * 設定取捨：
 * - weight 500 / 700：對齊 appSans（500 內文 base、700 對應 font-bold），讓中英字重相稱。
 * - subsets:["latin"]：Inter 拉丁子集小，preload（預設）可讓英數/時刻立即上字、不擋 LCP。
 * - display:swap：載入前先用 fallback 顯示，載完再換。
 *
 * 用法：以 CSS 變數 `--font-app-latin` 當單一來源（見 _app.tsx 注入 :root），
 * 在 body / MUI theme 的字體堆疊中排在 `--font-app-sans` 之前。
 */
export const appLatin = Inter({
  weight: ["500", "700"],
  subsets: ["latin"],
  display: "swap",
});

/**
 * 全站中文（CJK）主字體：Noto Sans TC（思源黑體繁中）。
 *
 * 動機：原本 body 直接吃系統字體堆疊（-apple-system / PingFang TC…），
 * 「字重」因此被各 OS 與 iOS『粗體文字』無障礙設定綁架——
 * 開粗體文字才好看、關了偏細，Android / Windows 又是完全不同字體。
 * 改用固定字重的自架 web font，讓所有人、所有平台看到一致的字重，
 * 且不會在已開 iOS 粗體文字的人身上再疊加加粗。
 *
 * 設定取捨：
 * - weight 500 / 700：500 當內文 base（取代過去隱含的 400，厚度接近 iOS 粗體文字），
 *   700 對應全站大量的 font-bold；其餘 600 / 900 由瀏覽器就近選代。
 * - 不指定 subsets + preload:false：CJK 沒有單一可預載 subset，省略 subsets 會自動
 *   涵蓋全部 unicode-range，瀏覽器只下載頁面實際用到的字符塊（train 站字集有限）。
 * - display:swap：先用系統字體 fallback 立即上字，載入後再換，不擋 LCP / FCP。
 * - adjustFontFallback:false：CJK 無對應的 metric-override fallback，關閉以免建置警告。
 *
 * 用法：以 CSS 變數 `--font-app-sans` 當單一來源（見 _app.tsx 注入 :root），
 * 供 global.scss 的 body 與 MUI theme（useMuiTheme.ts）共用。
 */
export const appSans = Noto_Sans_TC({
  weight: ["500", "700"],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  fallback: [
    "-apple-system",
    "BlinkMacSystemFont",
    "PingFang TC",
    "Roboto",
    "Microsoft YaHei",
    "Arial",
    "sans-serif",
  ],
});
