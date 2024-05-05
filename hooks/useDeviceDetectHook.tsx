import { useEffect, useState } from "react";

interface UseDeviceDetectResult {
  isIOS: boolean;
  isSafari: boolean;
}

const useDeviceDetect = (): UseDeviceDetectResult => {
  const [deviceDetect, setDeviceDetect] = useState({
    isIOS: false,
    isSafari: false,
  });

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    console.log(userAgent);
    const isIOS = /iphone|ipad|ipod/g.test(userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);

    setDeviceDetect({
      isIOS,
      isSafari,
    });
  }, []);

  return deviceDetect;
};

export default useDeviceDetect;
