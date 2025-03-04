import { useRouter } from "next/router";
import { PageEnum } from "../enums/PageEnum";
import { PathEnum } from "../enums/PathEnum";

interface UsePageResult {
  isTr: boolean;
  isThsr: boolean;
  isTymc: boolean;
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
  const isTr = !isThsr && !isTymc && !isUpdates && !isFeatures;

  let page: PageEnum;
  if (isThsr) {
    page = PageEnum.THSR;
  } else if (isTymc) {
    page = PageEnum.TYMC;
  } else if (isUpdates) {
    page = PageEnum.UPDATES;
  } else if (isFeatures) {
    page = PageEnum.FEATURES;
  } else {
    page = PageEnum.TR;
  }

  const localStorageKey = `${page}HistoryList`;
  const searchPath = `${PathEnum[`${page}Search`]}`;
  const homePath = `${PathEnum[`${page}Home`]}`;

  return {
    isTr,
    isThsr,
    isTymc,
    localStorageKey,
    searchPath,
    page,
    homePath,
  };
};

export default usePage;
