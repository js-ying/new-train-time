import { useRouter } from "next/router";
import { PageEnum } from "../enums/PageEnum";
import { PathEnum } from "../enums/PathEnum";

interface UsePageResult {
  isTr: boolean;
  isThsr: boolean;
  localStorageKey: string;
  searchPath: string;
  homePath: string;
  page: PageEnum;
}

const usePage = (): UsePageResult => {
  const { pathname } = useRouter();

  const isThsr = pathname.toLowerCase().includes(PageEnum.THSR);
  const isTr = !isThsr;

  const page = isTr ? PageEnum.TR : PageEnum.THSR;

  const localStorageKey = `${page}HistoryList`;
  const searchPath = `${PathEnum[`${page}Search`]}`;
  const homePath = `${PathEnum[`${page}Home`]}`;

  return {
    isTr,
    isThsr,
    localStorageKey,
    searchPath,
    page,
    homePath,
  };
};

export default usePage;
