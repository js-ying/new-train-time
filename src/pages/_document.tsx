// pages/_document.tsx
import { DocumentProps, Head, Html, Main, NextScript } from "next/document";

import { localeToHreflang } from "@/utils/HreflangUtils";

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
        {/*
          AdSense 提早建立連線，但實際載入交給 GoogleScript 的 next/script (afterInteractive)，
          避免 head 中 async script 在 hydration 前搶 main thread 而拖慢 LCP/FCP。
        */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link
          rel="dns-prefetch"
          href="https://pagead2.googlesyndication.com"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
