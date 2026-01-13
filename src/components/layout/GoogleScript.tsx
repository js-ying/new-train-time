import { GoogleAnalytics } from "@next/third-parties/google";

const GoogleScript = () => {
  return (
    <>
      {/* Google Analytics */}
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID as string} />

      {/* Google AdSense 移至 _document.tsx 維護 */}
    </>
  );
};

export default GoogleScript;
