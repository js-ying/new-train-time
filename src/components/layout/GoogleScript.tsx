import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";

/**
 * 全站第三方 script 集中載入。
 * - GA：交由 @next/third-parties 處理（內部已使用 afterInteractive）。
 * - AdSense：用 next/script 並設 strategy="afterInteractive"，符合 Google 建議的
 *   non-blocking async 載入方式，且確保不會在 hydration 前搶 main thread，
 *   避免拖慢 FCP / LCP（原放在 _document head 會被計入 render-blocking）。
 */
const GoogleScript = () => {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const adClient = process.env.NEXT_PUBLIC_AD_CLIENT;

  return (
    <>
      {/* Google Analytics（GA4）：只有設定 gaId 才載入。
          正式環境請用 GA4 量測 ID（G-XXXX），勿用已停用的 Universal Analytics
          （UA-，Google 自 2023/7 起停止處理資料）；本機 dev 把 gaId 留空即不載入，
          避免 localhost 流量污染正式 GA4。 */}
      {gaId && <GoogleAnalytics gaId={gaId} />}

      {/* Google AdSense */}
      {adClient && (
        <Script
          id="google-adsense"
          strategy="afterInteractive"
          async
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`}
        />
      )}
    </>
  );
};

export default GoogleScript;
