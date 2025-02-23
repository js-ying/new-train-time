import { useEffect, useState } from "react";

interface UseRwdResult {
  isMobile: boolean;
}

const useRwd = (): UseRwdResult => {
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    setWidth(window.innerWidth);
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { isMobile: width <= 768 };
};

export default useRwd;
