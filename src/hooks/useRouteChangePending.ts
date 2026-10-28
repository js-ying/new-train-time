import { useRouter } from "next/router";
import { useEffect, useState } from "react";

/**
 * 是否有非 shallow 的站內導頁正在進行（等待 gSSP 資料中）。
 * shallow 導頁不打 gSSP，不算 pending。
 */
const useRouteChangePending = (): boolean => {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const handleStart = (_url: string, { shallow }: { shallow: boolean }) => {
      if (!shallow) setPending(true);
    };
    // 被新導頁取消時會先觸發 routeChangeError，故結束一律清除
    const handleEnd = () => setPending(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleEnd);
    router.events.on("routeChangeError", handleEnd);
    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleEnd);
      router.events.off("routeChangeError", handleEnd);
    };
  }, [router.events]);

  return pending;
};

export default useRouteChangePending;
