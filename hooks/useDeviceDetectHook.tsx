import { useEffect, useState } from "react";

interface UseDeviceDetectResult {
  isIOS: boolean;
  isSafari: boolean;
  isFirefox: boolean;
  isArc: boolean;
  isPWAPromotable: boolean;
}

const useDeviceDetect = (): UseDeviceDetectResult => {
  const [deviceDetect, setDeviceDetect] = useState({
    isIOS: false,
    isSafari: false,
    isFirefox: false,
    isArc: false,
    isPWAPromotable: false,
  });

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    console.log(userAgent);
    const isIOS = /iphone|ipad|ipod/g.test(userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
    const isFirefox = /firefox|fxios/i.test(userAgent);
    const isArc = getComputedStyle(document.documentElement).getPropertyValue(
      "--arc-palette-background",
    )
      ? true
      : false;
    const isNonPWAPromotable = isIOS || isSafari || isFirefox || isArc;
    const isPWAPromotable = !isNonPWAPromotable;

    setDeviceDetect({
      isIOS,
      isSafari,
      isFirefox,
      isArc,
      isPWAPromotable,
    });
  }, []);

  return deviceDetect;
};

export default useDeviceDetect;
