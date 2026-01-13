import { GoogleAnalytics } from "@next/third-parties/google";

const GoogleScript = () => {
  return (
    <>
      {/* Google Analytics */}
      <GoogleAnalytics gaId={process.env.GA_ID} />

      {/* Google AdSense 移至 _document.tsx 維護 */}
    </>
  );
};

export default GoogleScript;
