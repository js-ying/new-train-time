import { useRouter } from "next/router";
import { notTransportPage, PageEnum } from "../enums/PageEnum";
import { PathEnum } from "../enums/PathEnum";

interface UsePageResult {
  isTr: boolean;
  isThsr: boolean;
  isTymc: boolean;
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
  const isUpdates = pathname.toLowerCase().includes(PageEnum.UPDATES);
  const isFeatures = pathname.toLowerCase().includes(PageEnum.FEATURES);
  const isPrivacy = pathname.toLowerCase().includes(PageEnum.PRIVACY);
  const isTerms = pathname.toLowerCase().includes(PageEnum.TERMS);
  // 台鐵為 fallback，需排除所有其他已知頁面
  const isTr =
    !isThsr &&
    !isTymc &&
    !isUpdates &&
    !isFeatures &&
    !isPrivacy &&
    !isTerms;
  const isHome =
    (isTr || isThsr || isTymc) && !pathname.toLowerCase().includes("search");

  let page: PageEnum;
  if (isThsr) {
    page = PageEnum.THSR;
  } else if (isTymc) {
    page = PageEnum.TYMC;
  } else if (isUpdates) {
    page = PageEnum.UPDATES;
  } else if (isFeatures) {
    page = PageEnum.FEATURES;
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
    isHome,
    localStorageKey,
    searchPath,
    page,
    homePath,
  };
};

export default usePage;
