import CommonDialog from "@/components/common/CommonDialog";
import { SearchAreaContext } from "@/contexts/SearchAreaContext";
import { GaEnum } from "@/enums/GaEnum";
import usePage from "@/hooks/usePage";
import useSearchHistory from "@/hooks/useSearchHistory";
import useSetting from "@/hooks/useSetting";
import { gaClickEvent } from "@/utils/GaUtils";
import { getStationNameById } from "@/utils/StationUtils";
import { Button } from "@heroui/react";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useContext, useState } from "react";

// 定義熱門路線
const popularTraRoutes = [
  { s: "1000", e: "1080" },
  { s: "4220", e: "4400" },
  { s: "1100", e: "1000" },
  { s: "6000", e: "4400" },
  { s: "1210", e: "1000" },
  { s: "1000", e: "0900" },
];

const popularThsrRoutes = [
  { s: "1030", e: "1040" },
  { s: "1000", e: "1040" },
  { s: "1070", e: "1000" },
  { s: "1040", e: "1000" },
  { s: "1000", e: "1070" },
  { s: "1040", e: "1020" },
];

const popularTymcRoutes = [
  { s: "A1", e: "A13" },
  { s: "A1", e: "A12" },
  { s: "A18", e: "A12" },
  { s: "A18", e: "A13" },
  { s: "A3", e: "A13" },
  { s: "A1", e: "A8" },
];

/**
 * 首頁熱門路線區塊
 */
const PopularRoutes: FC = () => {
  const { isTr, isThsr, isTymc, page, searchPath } = usePage();
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const params = useContext(SearchAreaContext);
  const { saveHistory } = useSearchHistory();
  const [, setShowPopularRoutes] = useSetting("showPopularRoutes");
  const [dialogOpen, setDialogOpen] = useState(false);

  let routes: { s: string; e: string }[] = [];

  if (isTr) {
    routes = popularTraRoutes;
  } else if (isThsr) {
    routes = popularThsrRoutes;
  } else if (isTymc) {
    routes = popularTymcRoutes;
  } else {
    return null;
  }

  // 防止 SSR 渲染時發生水合不匹配 (hydration mismatch)
  if (!i18n || !i18n.language) return null;

  /**
   * 處理點擊熱門路線
   * 1. 發送 GA 事件
   * 2. 儲存至搜尋歷史
   * 3. 跳轉至搜尋頁面
   */
  const handleRouteClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    routeS: string,
    routeE: string,
  ) => {
    e.preventDefault();

    // 送出 GA 事件
    if (isTr) {
      gaClickEvent(GaEnum.TR_POPULAR_ROUTE);
    } else if (isThsr) {
      gaClickEvent(GaEnum.THSR_POPULAR_ROUTE);
    } else if (isTymc) {
      gaClickEvent(GaEnum.TYMC_POPULAR_ROUTE);
    }

    saveHistory({ startStationId: routeS, endStationId: routeE });
    router.push({
      pathname: searchPath,
      query: {
        s: routeS,
        e: routeE,
        d: params.date,
        t: params.time.replace(":", ""),
      },
    });
  };

  /** 確認隱藏熱門路線 */
  const handleHidePopularRoutes = () => {
    setShowPopularRoutes(false);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-3 text-sm text-zinc-500 dark:text-zinc-400">
        {t("popularRoutes")}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {routes.map((route) => {
          const sName = isTymc
            ? route.s
            : getStationNameById(page, route.s, i18n.language) || route.s;
          const eName = isTymc
            ? route.e
            : getStationNameById(page, route.e, i18n.language) || route.e;
          const label = `${sName} ➔ ${eName}`;
          return (
            <Link
              key={`${route.s}-${route.e}`}
              href={{
                pathname: searchPath,
                query: {
                  s: route.s,
                  e: route.e,
                },
              }}
              onClick={(e) => handleRouteClick(e, route.s, route.e)}
              title={`${label} ${t(page + "Title")}`}
              className="rounded-full border border-zinc-400 px-4 py-1.5 text-xs text-zinc-600 transition-all hover:border-silverLakeBlue-500 hover:text-silverLakeBlue-500 dark:border-zinc-500 dark:text-zinc-300 dark:hover:border-gamboge-500 dark:hover:text-gamboge-500"
            >
              {label}
            </Link>
          );
        })}
      </div>

      {/* 關閉按鈕 */}
      <div className="mt-2 flex justify-center">
        <Button
          size="sm"
          variant="light"
          className="min-w-fit px-0 text-zinc-700 dark:text-zinc-200 sm:px-1.5"
          onPress={() => setDialogOpen(true)}
          aria-label="close-btn"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </Button>
      </div>

      {/* 確認隱藏彈窗 */}
      <CommonDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        title="reminderAlertTitle"
        confirmText="confirm"
        cancelText="cancel"
        onConfirm={handleHidePopularRoutes}
      >
        {t("hidePopularRoutesConfirmMsg")}
      </CommonDialog>
    </div>
  );
};

export default PopularRoutes;
