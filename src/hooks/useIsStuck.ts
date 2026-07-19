import { useEffect, useRef, useState } from "react";

/**
 * 偵測 sticky 元素是否已吸頂。
 * 把回傳的 sentinelRef 掛在 sticky 元素「正上方」的 sentinel；
 * sentinel 離開視窗頂端即代表 sticky 已吸頂（isStuck=true）。
 */
const useIsStuck = <T extends HTMLElement = HTMLDivElement>() => {
  const sentinelRef = useRef<T>(null);
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsStuck(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { sentinelRef, isStuck };
};

export default useIsStuck;
