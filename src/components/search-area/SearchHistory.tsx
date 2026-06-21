import { useAuth } from "@/contexts/AuthContext";
import {
  SearchAreaContext,
  SearchAreaUpdateContext,
} from "@/contexts/SearchAreaContext";
import { GaEnum } from "@/enums/GaEnum";
import useFavoriteRoutes from "@/hooks/useFavoriteRoutes";
import usePage from "@/hooks/usePage";
import useRwd from "@/hooks/useRwd";
import useSearchHistory from "@/hooks/useSearchHistory";
import useSetting from "@/hooks/useSetting";
import { MAX_FAVORITES } from "@/models/favorite-routes";
import { MAX_HISTORY, StoredHistoryInquiry } from "@/models/history";
import { gaClickEvent } from "@/utils/GaUtils";
import { getStationNameById } from "@/utils/StationUtils";
import { Button, Tab, Tabs } from "@heroui/react";
import { useTranslation } from "next-i18next";
import { FC, useContext, useEffect, useState } from "react";
import CommonDialog from "../common/CommonDialog";
import HeartIcon from "../icons/HeartIcon";

interface CloseButtonProps {
  onClick: () => void;
}

/** 關閉按鈕 */
const CloseButton: FC<CloseButtonProps> = ({ onClick }) => {
  return (
    <Button
      size="sm"
      variant="light"
      className="min-w-fit px-0 text-zinc-700 dark:text-zinc-200 sm:px-1.5"
      onPress={onClick}
      aria-label="close-btn"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </Button>
  );
};

/**
 * 搜尋區塊。依設定 showFavoriteRoutes 切換兩種型態：
 *  - 開啟：「歷史查詢 / 常用路線」雙分頁 + 收藏愛心（歷史、收藏各為獨立資料源）
 *  - 關閉：純歷史查詢清單（無分頁、無愛心），給不需要常用路線的使用者
 */
const SearchHistory: FC = () => {
  const { t, i18n } = useTranslation();
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);

  const { page, isTymc } = usePage();
  const { isMobile } = useRwd();
  const { user, loginWithGoogle } = useAuth();
  const onlyShowStationId = isTymc && isMobile;

  // 歷史（純時間序）與收藏分屬兩個 context、各自跨裝置同步
  const { historyList, clearHistory, consumeLocalSaveFlag } =
    useSearchHistory();
  const { favoriteList, addFavorite, removeFavorite, isFavorite } =
    useFavoriteRoutes();

  // 歷史查詢 / 常用路線各自的顯示開關；皆開時才出現雙分頁，並以 defaultSearchTab 決定預設停在哪個分頁
  const [showHistory] = useSetting("showHistory");
  const [showFavoriteRoutes] = useSetting("showFavoriteRoutes");
  const [defaultSearchTab] = useSetting("defaultSearchTab");

  // 未登入點愛心 → 跳登入引導；收藏已滿 → 跳上限提示
  const [loginOpen, setLoginOpen] = useState(false);
  const [limitOpen, setLimitOpen] = useState(false);

  // 歷史顯示快照：避免「按搜尋→導頁」前的重排閃動（唯一例外靠 localSaveFlag 跳過）。
  const [displayHistory, setDisplayHistory] =
    useState<StoredHistoryInquiry[]>(historyList);
  useEffect(() => {
    if (consumeLocalSaveFlag()) return;
    setDisplayHistory(historyList);
  }, [historyList, consumeLocalSaveFlag]);

  const handleHistoryClick = (startStationId: string, endStationId: string) => {
    gaClickEvent(GaEnum.HISTORY);
    setParams({ ...params, startStationId, endStationId });
  };

  // 清除歷史：歷史歸 0（收藏為獨立表，不受影響）；即時清空顯示快照
  const handleClear = () => {
    clearHistory();
    setDisplayHistory([]);
  };

  // 切換收藏：未登入跳登入引導；已收藏→移除；未收藏→加入（已滿跳上限提示）
  const handleToggleFavorite = (
    startStationId: string,
    endStationId: string,
  ) => {
    if (!user) {
      setLoginOpen(true);
      return;
    }
    const fav = isFavorite(startStationId, endStationId);
    gaClickEvent(fav ? GaEnum.UNFAVORITE_ROUTE : GaEnum.FAVORITE_ROUTE);
    if (fav) {
      removeFavorite(startStationId, endStationId);
    } else if (addFavorite(startStationId, endStationId) === "limit") {
      setLimitOpen(true);
    }
  };

  // tab 標題 + 「已有 / 上限」計數（小字）
  const tabTitle = (label: string, count: number, max: number) => (
    <span className="flex items-center gap-1">
      {label}
      <span className="text-xs text-zinc-400 dark:text-zinc-500">
        {count} / {max}
      </span>
    </span>
  );

  // 單列站名按鈕；showFavoriteRoutes 開啟時於右側附收藏愛心（愛心狀態一律查收藏 context）。
  // 等寬：列為 relative 區塊，被 flex-col 的 align-items:stretch 撐成最寬按鈕寬，按鈕 w-full 撐滿。
  const renderRow = (item: {
    startStationId: string;
    endStationId: string;
  }) => {
    const fav =
      showFavoriteRoutes && isFavorite(item.startStationId, item.endStationId);
    return (
      <div
        className="relative"
        key={`${item.startStationId}-${item.endStationId}`}
      >
        <Button
          className="h-8 w-full min-w-fit bg-neutral-500 text-sm text-white dark:bg-neutral-600"
          size="sm"
          radius="sm"
          onPress={() =>
            handleHistoryClick(item.startStationId, item.endStationId)
          }
        >
          {onlyShowStationId ? (
            `${item.startStationId} ➔ ${item.endStationId}`
          ) : (
            <>
              {getStationNameById(page, item.startStationId, i18n.language)} ➔{" "}
              {getStationNameById(page, item.endStationId, i18n.language)}
            </>
          )}
        </Button>
        {showFavoriteRoutes && (
          <button
            type="button"
            aria-label="favorite-toggle"
            className={`absolute left-full top-1/2 ml-1.5 -translate-y-1/2 ${
              fav
                ? "text-rose-500 dark:text-rose-500/80"
                : "text-zinc-400 dark:text-zinc-500"
            }`}
            onClick={() =>
              handleToggleFavorite(item.startStationId, item.endStationId)
            }
          >
            <HeartIcon filled={fav} className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  };

  // 單一清單型態（只開歷史或只開常用時）：標題 + 置中清單。
  // 歷史附清除鈕；常用不附（逐筆靠愛心移除）。
  const renderFlatList = (
    title: string,
    items: { startStationId: string; endStationId: string }[],
    withClear: boolean,
  ) => (
    <div className="text-center">
      {/* 標題：共 X / 5 筆 */}
      <div className="mb-2.5 text-sm text-zinc-500 dark:text-zinc-400">
        {title}
      </div>
      <div className="flex justify-center">
        <div className="flex flex-col gap-2.5">
          {items.map(renderRow)}
          {withClear && (
            <div className="flex justify-center">
              <CloseButton onClick={handleClear} />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // 愛心互動相關 dialog（未登入引導 / 收藏已滿）；常用路線出現時皆需掛載
  const favoriteDialogs = (
    <>
      {/* 未登入點愛心：引導登入 */}
      <CommonDialog
        open={loginOpen}
        setOpen={setLoginOpen}
        title="favoriteRequiresLoginTitle"
        confirmText="login"
        cancelText="cancel"
        onConfirm={() => {
          gaClickEvent(GaEnum.LOGIN_WITH_GOOGLE);
          void loginWithGoogle();
        }}
      >
        {t("favoriteRequiresLogin")}
      </CommonDialog>

      {/* 收藏已滿 5 筆：提示先移除 */}
      <CommonDialog
        open={limitOpen}
        setOpen={setLimitOpen}
        title="favoriteLimitTitle"
        confirmText="gotItLabel"
      >
        {t("favoriteLimitReached")}
      </CommonDialog>
    </>
  );

  // 兩者皆關 → 整塊不顯示
  if (!showHistory && !showFavoriteRoutes) return null;

  // 只開歷史查詢：純歷史清單（無分頁、無愛心），標題「歷史查詢：共 X / 5 筆」。
  // 無歷史 → 整塊不顯示（導頁前不重排：靠 displayHistory 快照）
  if (showHistory && !showFavoriteRoutes) {
    if (displayHistory.length === 0) return null;
    return renderFlatList(
      t("historyInquiry", { nowLength: displayHistory.length }),
      displayHistory,
      true,
    );
  }

  // 只開常用路線：純常用清單（無分頁、含愛心），標題「常用路線：共 X / 5 筆」。
  // 無收藏 → 整塊不顯示
  if (!showHistory && showFavoriteRoutes) {
    if (favoriteList.length === 0) return null;
    return (
      <>
        {renderFlatList(
          t("favoritesInquiry", { nowLength: favoriteList.length }),
          favoriteList,
          false,
        )}
        {favoriteDialogs}
      </>
    );
  }

  // 兩者皆開 → 雙分頁。
  // 兩分頁皆空 → 整塊不顯示（連帶不需要 dialog）。
  // 用 displayHistory（快照）而非 historyList：空清單按搜尋時 localSaveFlag 會讓快照維持空、
  // 跳過重排，導頁前就不會先閃出 tab 標題（與歷史既有的「導頁前不重排」一致）。
  if (displayHistory.length === 0 && favoriteList.length === 0) return null;

  return (
    <>
      {/* 預設停在設定選的分頁；key 綁定設定值，設定水合較慢時讓 Tabs 重掛以套用新預設 */}
      <Tabs
        key={defaultSearchTab}
        defaultSelectedKey={defaultSearchTab}
        aria-label="歷史查詢與常用路線"
        size="md"
        variant="underlined"
        classNames={{
          tabList: "gap-0",
          // active 底線：細一點（2px → 1px）；HeroUI underlined 預設只取 tab 寬度 80%（置中），
          // 計入「X / 5」後會明顯短於標題，放大 scale-x 補回至涵蓋整個標題
          cursor: "h-px scale-x-110",
          // 取消 HeroUI 預設 hover-unselected 變透明 (opacity-disabled)，只讓字變亮（不加背景）
          tab: "data-[hover-unselected=true]:opacity-100 px-2",
          tabContent:
            "group-data-[hover-unselected=true]:text-zinc-600 dark:group-data-[hover-unselected=true]:text-zinc-300",
        }}
      >
        {/* 歷史查詢：純時間序 */}
        <Tab
          key="history"
          title={tabTitle(t("historyTab"), displayHistory.length, MAX_HISTORY)}
        >
          <div className="mt-1 flex justify-center">
            {displayHistory.length > 0 ? (
              <div className="flex flex-col gap-2.5">
                {displayHistory.map(renderRow)}
                {/* 清除歷史 */}
                <div className="flex justify-center">
                  <CloseButton onClick={handleClear} />
                </div>
              </div>
            ) : (
              <p className="px-4 py-2 text-sm text-zinc-400 dark:text-zinc-500">
                {t("historyEmptyHint")}
              </p>
            )}
          </div>
        </Tab>

        {/* 常用路線：收藏 */}
        <Tab
          key="favorites"
          title={tabTitle(
            t("favoritesTab"),
            favoriteList.length,
            MAX_FAVORITES,
          )}
        >
          <div className="mt-1 flex justify-center">
            {favoriteList.length > 0 ? (
              <div className="flex flex-col gap-2.5">
                {favoriteList.map(renderRow)}
              </div>
            ) : (
              <p className="px-4 text-sm text-zinc-400 dark:text-zinc-500">
                {t("favoritesEmptyHint")}
              </p>
            )}
          </div>
        </Tab>
      </Tabs>

      {favoriteDialogs}
    </>
  );
};

export default SearchHistory;
