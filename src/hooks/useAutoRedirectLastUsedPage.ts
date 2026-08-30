import usePage from "@/hooks/usePage";
import { LAST_USED_PATH_KEY, resolveRedirectTarget } from "@/utils/PageUtils";
import { useRouter } from "next/router";
import { useEffect } from "react";

// 僅整頁載入時判定一次（_app 不隨 SPA 導航 remount）
const useAutoRedirectLastUsedPage = () => {
  const router = useRouter();
  const { isHome } = usePage();

  useEffect(() => {
    const target = resolveRedirectTarget({
      enabled: localStorage.getItem("autoRedirectLastUsedPage") === "true",
      isHome,
      lastUsedPath: localStorage.getItem(LAST_USED_PATH_KEY),
      currentPathname: router.pathname,
    });

    if (target) router.push(target);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useAutoRedirectLastUsedPage;
