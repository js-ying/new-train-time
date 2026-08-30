import { PageEnum } from "@/enums/PageEnum";
import { PathEnum } from "@/enums/PathEnum";

// 上次使用頁面的 localStorage key，值為站內路徑
export const LAST_USED_PATH_KEY = "lastUsedPath";

const getHomePath = (page: PageEnum): string => {
  switch (page) {
    case PageEnum.TR:
      return PathEnum.trHome;
    case PageEnum.THSR:
      return PathEnum.thsrHome;
    case PageEnum.TYMC:
      return PathEnum.tymcHome;
    case PageEnum.BUS:
      return PathEnum.busHome;
    default:
      return PathEnum.trHome;
  }
};

// 記錄上次使用頁面；須傳入固定路徑，不可用 router.asPath（會連 query 一起記）
const recordLastUsedPath = (path: string) => {
  localStorage.setItem(LAST_USED_PATH_KEY, path);
};

// localStorage 可被竄改，導頁前限定站內路徑；"//" 開頭會被當 protocol-relative 導向外站
const isInternalPath = (path: string | null): path is string =>
  !!path && path.startsWith("/") && !path.startsWith("//");

/** 自動導頁的目標路徑；不該導頁時回 null（未啟用 / 非三鐵首頁 / 值無效 / 已在目標頁） */
const resolveRedirectTarget = (params: {
  enabled: boolean;
  isHome: boolean;
  lastUsedPath: string | null;
  currentPathname: string;
}): string | null => {
  const { enabled, isHome, lastUsedPath, currentPathname } = params;
  if (!enabled || !isHome) return null;
  if (!isInternalPath(lastUsedPath)) return null;
  return lastUsedPath === currentPathname ? null : lastUsedPath;
};

export { getHomePath, recordLastUsedPath, resolveRedirectTarget };
