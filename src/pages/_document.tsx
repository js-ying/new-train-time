// pages/_document.tsx
import { DocumentProps, Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";

import { localeToHreflang } from "@/utils/HreflangUtils";

/**
 * 熱門路線快查首屏前（pre-paint）隱藏機制。
 * - 區塊 DOM 永遠輸出（SSR/SEO 可爬、避免 hydration mismatch），顯示與否純靠 CSS。
 * - CSS 與 script 皆置於 <head>（先於 body 解析），故能在首屏前生效、消除「先顯示再隱藏」閃爍。
 *   critical CSS 內聯於此而非 global.scss：dev 模式 global.scss 由 JS 注入會晚一拍。
 * - script 僅在 localStorage 明確為 "false" 時加 class；crawler / 預設(true) 一律顯示。
 *   執行期變更（設定頁切換、client 換頁）由 SettingProvider 的 effect 同步。
 */
const HIDE_POPULAR_ROUTES_CSS =
  ".hide-popular-routes .js-popular-routes{display:none}";
const HIDE_POPULAR_ROUTES_SCRIPT =
  "try{if(localStorage.getItem('showPopularRoutes')==='false')document.documentElement.classList.add('hide-popular-routes')}catch(e){}";

/**
 * 自訂 Document 元件，設定 HTML 的語言屬性和全站共用的 head 標籤。
 * Next.js 會根據 i18n 設定自動注入正確的 lang 屬性。
 */
export default function Document(props: DocumentProps) {
  // Next.js 會自動根據當前語言環境設定 __NEXT_DATA__.locale
  // 這裡直接使用 props.locale 來取得當前語言
  const currentLocale = props.__NEXT_DATA__.locale || "zh-TW";
  // 對外輸出採 BCP-47 + ISO 15924 書寫系統碼（zh-TW → zh-Hant），與 hreflang 一致
  const htmlLang = localeToHreflang(currentLocale);

  return (
    <Html lang={htmlLang}>
      <Head>
        {/* 明確設定 charset，避免重複 */}
        <meta charSet="utf-8" />
        {/* 熱門路線快查首屏前隱藏 */}
        <style>{HIDE_POPULAR_ROUTES_CSS}</style>
        <Script id="hide-popular-routes" strategy="beforeInteractive">
          {HIDE_POPULAR_ROUTES_SCRIPT}
        </Script>
        {/*
          AdSense 提早建立連線，但實際載入交給 GoogleScript 的 next/script (afterInteractive)，
          避免 head 中 async script 在 hydration 前搶 main thread 而拖慢 LCP/FCP。
        */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
