import { GoogleAnalytics } from "@next/third-parties/google";

const GoogleScript = () => {
  return (
    <>
      {/* Google Analytics */}
      <GoogleAnalytics gaId="UA-48330157-6" />

      {/* Google AdSense 移至 _document.tsx 維護 */}
    </>
  );
};

export default GoogleScript;
