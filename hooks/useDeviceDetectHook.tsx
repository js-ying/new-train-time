import { useEffect, useState } from "react";

interface UseDeviceDetectResult {
  isIOS: boolean;
}

const useDeviceDetect = (): UseDeviceDetectResult => {
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/g.test(userAgent);

    setIsIOS(isIOS);
  }, []);

  return { isIOS };
};

export default useDeviceDetect;
