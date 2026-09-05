import {
  getAvailableTabs,
  getPanelLayout,
  resolveDefaultTab,
  SearchPanelTabKey,
  SearchPanelTabView,
} from "@/configs/searchPanelTabs";
import { useAuth } from "@/contexts/AuthContext";
import { routeKey } from "@/contexts/FavoriteRoutesContext";
import {
  SearchAreaContext,
  SearchAreaUpdateContext,
} from "@/contexts/SearchAreaContext";
import { GaEnum } from "@/enums/GaEnum";
import useFavoriteRoutes from "@/hooks/useFavoriteRoutes";
import usePage from "@/hooks/usePage";
import useReorderMode from "@/hooks/useReorderMode";
import useRwd from "@/hooks/useRwd";
import useSearchHistory from "@/hooks/useSearchHistory";
import useSetting from "@/hooks/useSetting";
import { StoredHistoryInquiry } from "@/models/history";
import { gaClickEvent } from "@/utils/GaUtils";
import { getStationNameById } from "@/utils/StationUtils";
import { Button, Tab, Tabs } from "@heroui/react";
import { useTranslation } from "next-i18next";
import {
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import CommonDialog from "../common/CommonDialog";
import { ReorderArrows, ReorderToolbar } from "../common/ReorderControls";
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
 * 搜尋區塊：「歷史查詢 / 常用路線」分頁（兩者各為獨立資料源，常用附收藏愛心）。
 * 可用分頁由顯示開關決定；只剩一個時不出分頁列，直接呈現標題 + 清單。
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
  const {
    historyList,
    limit: historyLimit,
    clearHistory,
    consumeLocalSaveFlag,
  } = useSearchHistory();
  const {
    favoriteList,
    limit: favoriteLimit,
    addFavorite,
    removeFavorite,
    isFavorite,
    reorderFavorites,
  } = useFavoriteRoutes();

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

  // 常用路線排序：進入模式後該列不再觸發查詢，愛心換成上下移，按「完成」才寫入
  const handleSaveOrder = useCallback(
    (orderedKeys: string[]) => {
      gaClickEvent(GaEnum.REORDER_FAVORITE);
      reorderFavorites(orderedKeys);
    },
    [reorderFavorites],
  );
  const reorder = useReorderMode(favoriteList, routeKey, handleSaveOrder);

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
  // 等寬：列被 flex-col 的 align-items:stretch 撐成最寬列寬，按鈕 w-full 撐滿。
  // 愛心不佔文檔流（absolute），排序箭頭則佔位，避免窄螢幕溢出畫面右緣。
  const renderRow = (
    item: { startStationId: string; endStationId: string },
    ctx: { index: number; total: number; reordering: boolean },
  ) => {
    const fav =
      showFavoriteRoutes && isFavorite(item.startStationId, item.endStationId);
    return (
      <div
        className="flex items-center gap-1.5"
        key={`${item.startStationId}-${item.endStationId}`}
      >
        <div className="relative flex-1">
          <Button
            className="h-8 w-full min-w-fit bg-secondary text-sm text-secondary-foreground"
            size="sm"
            radius="sm"
            isDisabled={ctx.reordering}
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
          {!ctx.reordering && showFavoriteRoutes && (
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
        {ctx.reordering && (
          <ReorderArrows
            index={ctx.index}
            total={ctx.total}
            onMove={reorder.move}
          />
        )}
      </div>
    );
  };

  // 清單本體：等寬單欄。歷史附清除鈕；常用附排序鈕（逐筆移除仍靠愛心）。
  const renderList = (
    items: { startStationId: string; endStationId: string }[],
    options: { reordering?: boolean; footer?: ReactNode } = {},
  ) => (
    <div className="flex flex-col gap-2.5">
      {items.map((item, index) =>
        renderRow(item, {
          index,
          total: items.length,
          reordering: !!options.reordering,
        }),
      )}
      {options.footer}
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

      {/* 收藏已達上限：提示先移除 */}
      <CommonDialog
        open={limitOpen}
        setOpen={setLimitOpen}
        title="favoriteLimitTitle"
        confirmText="gotItLabel"
      >
        {t("favoriteLimitReached", { max: favoriteLimit })}
      </CommonDialog>
    </>
  );

  const emptyHint = (text: string, spacing = "px-4") => (
    <p className={`${spacing} text-sm text-zinc-400 dark:text-zinc-500`}>
      {text}
    </p>
  );

  // 可用分頁與版面由 registry 決定；可用性只看設定，與有無資料無關
  const availableTabs = getAvailableTabs("od", {
    showHistory,
    showFavoriteRoutes,
    // OD 面板無常用站牌分頁，此開關不影響結果
    showFavoriteStops: false,
  });
  const layout = getPanelLayout(availableTabs);
  const selectedTab = resolveDefaultTab(defaultSearchTab, availableTabs);

  const tabViews: Partial<Record<SearchPanelTabKey, SearchPanelTabView>> = {
    // 歷史查詢：純時間序
    history: {
      label: t("historyTab"),
      count: displayHistory.length,
      max: historyLimit,
      inquiryTitle: t("historyInquiry", {
        nowLength: displayHistory.length,
        max: historyLimit,
      }),
      emptyNode: emptyHint(t("historyEmptyHint"), "px-4 py-2"),
      list: renderList(displayHistory, {
        footer: (
          <div className="flex justify-center">
            <CloseButton onClick={handleClear} />
          </div>
        ),
      }),
    },
    // 常用路線：收藏
    favorites: {
      label: t("favoritesTab"),
      count: favoriteList.length,
      max: favoriteLimit,
      inquiryTitle: t("favoritesInquiry", {
        nowLength: favoriteList.length,
        max: favoriteLimit,
      }),
      emptyNode: emptyHint(t("favoritesEmptyHint")),
      // 排序中渲染草稿；僅 1 筆無從排序，但已在排序中則保留工具列讓使用者收尾
      list: renderList(reorder.list, {
        reordering: reorder.isReordering,
        footer:
          favoriteList.length > 1 || reorder.isReordering ? (
            <ReorderToolbar
              isReordering={reorder.isReordering}
              onStart={reorder.start}
              onSave={reorder.save}
              onCancel={reorder.cancel}
            />
          ) : undefined,
      }),
    },
  };

  if (layout === "none") return null;

  // 可用分頁全無資料 → 整塊不顯示（連帶不需要 dialog）。
  // 歷史用 displayHistory（快照）而非 historyList：空清單按搜尋時 localSaveFlag 會讓快照維持空、
  // 跳過重排，導頁前就不會先閃出 tab 標題（與歷史既有的「導頁前不重排」一致）。
  const filled = availableTabs.filter((tab) => tabViews[tab]!.count > 0);
  if (filled.length === 0) return null;

  // 單一分頁 → 標題 + 清單直接呈現（無分頁列）
  if (layout === "flat") {
    const view = tabViews[availableTabs[0]]!;
    return (
      <>
        <div className="text-center">
          {/* 標題：共 X / 5 筆 */}
          <div className="mb-2.5 text-sm text-muted-foreground">
            {view.inquiryTitle}
          </div>
          <div className="flex justify-center">{view.list}</div>
        </div>
        {showFavoriteRoutes && favoriteDialogs}
      </>
    );
  }

  return (
    <>
      {/* 預設停在設定選的分頁（不可用時沿 fallback 鏈收斂）；
          key 綁定該值，設定水合較慢時讓 Tabs 重掛以套用新預設 */}
      <Tabs
        key={selectedTab}
        defaultSelectedKey={selectedTab}
        onSelectionChange={reorder.cancel}
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
        {availableTabs.map((tab) => {
          const view = tabViews[tab]!;
          return (
            <Tab key={tab} title={tabTitle(view.label, view.count, view.max)}>
              <div
                className={`${view.tabBodyClass ?? "mt-1"} flex justify-center`}
              >
                {view.count > 0 ? view.list : view.emptyNode}
              </div>
            </Tab>
          );
        })}
      </Tabs>

      {favoriteDialogs}
    </>
  );
};

export default SearchHistory;
