import { Inter, Noto_Sans_TC } from "next/font/google";

/**
 * 西文與數字字體：Inter（自架、固定字重），只負責英數；中文由 appSans（Noto）承接。
 * - 不需 unicode-range：Inter 不含 CJK（含全形標點），字體堆疊逐字回退即可；
 *   且非系統字，不會像 `-apple-system` 在 Safari 觸發系統 CJK fallback（PingFang）。
 * - weight 500 / 700：對齊 appSans，讓中英字重相稱。
 * - subsets:["latin"]：子集小，preload（預設）讓英數/時刻立即上字、不擋 LCP。
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
 * 固定字重的自架 web font：全平台字重一致，不受 iOS「粗體文字」等系統設定影響。
 * - weight 500 / 700：500 當內文 base、700 對應 font-bold；其餘由瀏覽器就近選代。
 * - 不指定 subsets + preload:false：CJK 沒有單一可預載 subset，省略 subsets 會自動
 *   涵蓋全部 unicode-range，瀏覽器只下載頁面實際用到的字符塊。
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
