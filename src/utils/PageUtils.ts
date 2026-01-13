import { PageEnum } from "@/enums/PageEnum";
import { PathEnum } from "@/enums/PathEnum";
import { LAST_USED_PAGE_KEY } from "@/hooks/useAutoRedirectLastUsedPage";

const getHomePath = (page: PageEnum | string) => {
  switch (page) {
    case PageEnum.TR || PageEnum.TR.toString():
      return PathEnum.trHome;
    case PageEnum.THSR || PageEnum.THSR.toString():
      return PathEnum.thsrHome;
    case PageEnum.TYMC || PageEnum.TYMC.toString():
      return PathEnum.tymcHome;
    default:
      return "/";
  }
};

const recordLastUsedPage = (page: PageEnum) => {
  localStorage.setItem(LAST_USED_PAGE_KEY, page);
};

export { getHomePath, recordLastUsedPage };
