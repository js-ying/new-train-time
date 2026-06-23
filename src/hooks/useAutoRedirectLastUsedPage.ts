import usePage from "@/hooks/usePage";
import { getHomePath } from "@/utils/PageUtils";
import { useRouter } from "next/router";
import { useEffect } from "react";

// 上次使用頁面的 localStorage key
export const LAST_USED_PAGE_KEY = "lastUsedPage";

const useAutoRedirectLastUsedPage = () => {
  const router = useRouter();
  const { page, isHome } = usePage();

  useEffect(() => {
    const autoRedirectLastUsedPage: boolean =
      localStorage.getItem("autoRedirectLastUsedPage") === "true";
    const lastUsedPage: string = localStorage.getItem(LAST_USED_PAGE_KEY);

    // /station（單站時刻表）雖被 usePage 歸為 TR-fallback 的 isHome，但它是獨立著陸頁、
    // 非鐵路首頁，不該被自動導頁劫持（否則帶站 SSR 進來會被彈回 /THSR）。
    if (router.pathname.includes("station")) return;

    // 若有啟用自動導頁，且目前頁面為首頁類型 (TR/THSR/TYMC 任一)，且上次使用頁面不是目前頁面，則導頁
    if (
      autoRedirectLastUsedPage &&
      isHome &&
      lastUsedPage !== page.toString()
    ) {
      router.push(getHomePath(lastUsedPage));
    }
  }, []);
};

export default useAutoRedirectLastUsedPage;
