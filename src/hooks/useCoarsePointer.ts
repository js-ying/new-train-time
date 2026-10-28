import { useEffect, useState } from "react";

const QUERY = "(pointer: coarse)";

/** 主要指標是否為觸控（`pointer: coarse`）；SSR 與首次 render 回 false。 */
const useCoarsePointer = (): boolean => {
  const [isCoarse, setIsCoarse] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia?.(QUERY);
    if (!mql) return;
    setIsCoarse(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setIsCoarse(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isCoarse;
};

export default useCoarsePointer;
