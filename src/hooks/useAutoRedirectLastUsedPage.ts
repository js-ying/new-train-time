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
