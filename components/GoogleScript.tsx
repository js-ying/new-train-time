import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";

const GoogleScript = () => {
  return (
    <>
      {/* Google Analytics */}
      <GoogleAnalytics gaId="UA-48330157-6" />

      {/* Google AdSense */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7992139989807299"
        crossOrigin="anonymous"
      />
    </>
  );
};

export default GoogleScript;
