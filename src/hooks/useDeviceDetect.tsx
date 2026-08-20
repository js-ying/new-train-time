import { useEffect, useState } from "react";

interface UseDeviceDetectResult {
  /** Apple 行動裝置（iPhone / iPad / iPod）；iPadOS 13 起送 desktop-class UA，故改以觸控點數辨識 */
  isAppleMobile: boolean;
  /** macOS Safari */
  isMacSafari: boolean;
  isFirefox: boolean;
  isAndroid: boolean;
  isPWAPromotable: boolean;
  /** 瀏覽器本身有無 beforeinstallprompt；僅供「是否真的無安裝管道」判斷，不參與 isPWAPromotable */
  canPromptInstall: boolean;
  isMobile: boolean;
  /** 是否在「加到主畫面」啟動的 standalone PWA 模式下開啟 */
  isStandalone: boolean;
}

const useDeviceDetect = (): UseDeviceDetectResult => {
  const [deviceDetect, setDeviceDetect] = useState({
    isAppleMobile: false,
    isMacSafari: false,
    isFirefox: false,
    isAndroid: false,
    isPWAPromotable: false,
    canPromptInstall: false,
    isMobile: false,
    isStandalone: false,
  });

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    // iPhone/iPad 的 UA 都含 mac；iPad 自 iPadOS 13 起不再出現 ipad 字樣，改認多點觸控
    const isAppleMobile =
      /iphone|ipod/.test(userAgent) ||
      (/mac/.test(userAgent) &&
        navigator.maxTouchPoints > 2 &&
        "serviceWorker" in navigator);
    // version/ 是 Safari 專有 token；Edge on Mac 的 UA 含 safari 卻不含 chrome，用排除法會誤判
    const isMacSafari =
      !isAppleMobile &&
      /macintosh/.test(userAgent) &&
      / version\/\d+/.test(userAgent);
    const isFirefox = /firefox|fxios/i.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent,
      ) || isAppleMobile;

    // standalone PWA 判定：iOS 用 navigator.standalone，其他平台用 display-mode media query
    const nav = navigator as Navigator & { standalone?: boolean };
    const isStandalone =
      nav.standalone === true ||
      window.matchMedia?.("(display-mode: standalone)").matches === true;

    const isNonPWAPromotable = isAppleMobile || isMacSafari || isFirefox;
    const isPWAPromotable = !isNonPWAPromotable;
    const canPromptInstall = "BeforeInstallPromptEvent" in window;

    setDeviceDetect({
      isAppleMobile,
      isMacSafari,
      isFirefox,
      isAndroid,
      isPWAPromotable,
      canPromptInstall,
      isMobile,
      isStandalone,
    });
  }, []);

  return deviceDetect;
};

export default useDeviceDetect;
