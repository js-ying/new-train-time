import { useRouter } from "next/router";
import { notTransportPage, PageEnum } from "../enums/PageEnum";
import { PathEnum } from "../enums/PathEnum";

interface UsePageResult {
  isTr: boolean;
  isThsr: boolean;
  isTymc: boolean;
  isBus: boolean;
  isHome: boolean;
  localStorageKey: string;
  searchPath: string;
  homePath: string;
  page: PageEnum;
}

const usePage = (): UsePageResult => {
  const { pathname } = useRouter();

  const isThsr = pathname.toLowerCase().includes(PageEnum.THSR);
  const isTymc = pathname.toLowerCase().includes(PageEnum.TYMC);
  const isBus = pathname.toLowerCase().includes(PageEnum.BUS);
  const isUpdates = pathname.toLowerCase().includes(PageEnum.UPDATES);
  const isFeatures = pathname.toLowerCase().includes(PageEnum.FEATURES);
  const isSettings = pathname.toLowerCase().includes(PageEnum.SETTINGS);
  const isPrivacy = pathname.toLowerCase().includes(PageEnum.PRIVACY);
  const isTerms = pathname.toLowerCase().includes(PageEnum.TERMS);
  // 台鐵為 fallback，需排除所有其他已知頁面
  const isTr =
    !isThsr &&
    !isTymc &&
    !isBus &&
    !isUpdates &&
    !isFeatures &&
    !isSettings &&
    !isPrivacy &&
    !isTerms;
  // 僅三鐵首頁；/station、/premium 等雖走 isTr fallback，但不是鐵路首頁
  const isHome = (
    [PathEnum.trHome, PathEnum.thsrHome, PathEnum.tymcHome] as string[]
  ).includes(pathname);

  /** 依據路徑判斷當前所在頁面 */
  let page: PageEnum;
  if (isThsr) {
    page = PageEnum.THSR;
  } else if (isTymc) {
    page = PageEnum.TYMC;
  } else if (isBus) {
    page = PageEnum.BUS;
  } else if (isUpdates) {
    page = PageEnum.UPDATES;
  } else if (isFeatures) {
    page = PageEnum.FEATURES;
  } else if (isSettings) {
    page = PageEnum.SETTINGS;
  } else if (isPrivacy) {
    page = PageEnum.PRIVACY;
  } else if (isTerms) {
    page = PageEnum.TERMS;
  } else {
    page = PageEnum.TR;
  }

  const localStorageKey = `${page}HistoryList`;
  const searchPath = `${PathEnum[`${page}Search`]}`;
  const homePath = `${notTransportPage.includes(page) ? PathEnum[`${PageEnum.TR}Home`] : PathEnum[`${page}Home`]}`;

  return {
    isTr,
    isThsr,
    isTymc,
    isBus,
    isHome,
    localStorageKey,
    searchPath,
    page,
    homePath,
  };
};

export default usePage;
