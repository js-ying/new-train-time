import { useState } from "react";

interface UseRwdResult {
  isMobile: boolean;
}

const useRwd = (): UseRwdResult => {
  const [width] = useState<number>(window.innerWidth);
  const isMobile = width <= 768;

  return {
    isMobile,
  };
};

export default useRwd;
