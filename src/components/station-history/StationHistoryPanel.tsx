import {
  getAvailableTabs,
  getPanelLayout,
  resolveDefaultTab,
  SearchPanelScope,
  SearchPanelTabKey,
  SearchPanelTabView,
} from "@/configs/searchPanelTabs";
import { useAuth } from "@/contexts/AuthContext";
import { GaEnum } from "@/enums/GaEnum";
import useSetting from "@/hooks/useSetting";
import useStationFavorites from "@/hooks/useStationFavorites";
import useStationHistory from "@/hooks/useStationHistory";
import { StationTarget, StationTrainType } from "@/models/station-history";
import { gaClickEvent } from "@/utils/GaUtils";
import { Button, Tab, Tabs } from "@heroui/react";
import { useTranslation } from "next-i18next";
import { FC, ReactNode, useState } from "react";
import CommonDialog from "../common/CommonDialog";
import HeartIcon from "../icons/HeartIcon";

/** trainType → 分頁全集；BUS_STOP 僅作收藏分類，面板不會以它掛載 */
const SCOPE_BY_TRAIN_TYPE: Record<StationTrainType, SearchPanelScope> = {
  TR: "trStation",
  BUS: "bus",
  BUS_STOP: "bus",
};

interface StationHistoryPanelProps {
  /** TR=台鐵單站、BUS=公車路線；決定收藏分組與文案（車站 / 路線） */
  trainType: StationTrainType;
  /** 點某筆歷史 / 常用 → 帶該 target 回呼，由頁面決定如何重查 */
  onSelect: (target: StationTarget) => void;
  /** 顯示名解析（TR 即時 i18n 重解析站名；公車省略，直接用儲存名） */
  resolveLabel?: (target: StationTarget) => string;
  /** 次要標籤（公車用：縣市 / 來源，區分同名不同路線如台中 vs 新竹的 182）；無則不顯示 */
  resolveSubLabel?: (target: StationTarget) => string | undefined;
  /** 附加「常用站牌」分頁（BUS_STOP 收藏，公車頁用）；內容由頁面注入（到站卡片看板） */
  stopFavorites?: { count: number; content: ReactNode };
}

/** 清除按鈕（X icon），沿用 OD SearchHistory 樣式 */
const CloseButton: FC<{ onClick: () => void }> = ({ onClick }) => (
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

/**
 * 通用單點查詢「歷史 / 常用」面板（台鐵單站 / 公車共用）。
 * 對應 OD SearchHistory，差別在資料為單一 target（站 / 路線），文案依車種切「車站 / 路線」；
 * 公車另有「常用站牌」分頁，內容由頁面注入。
 */
const StationHistoryPanel: FC<StationHistoryPanelProps> = ({
  trainType,
  onSelect,
  resolveLabel,
  resolveSubLabel,
  stopFavorites,
}) => {
  const { t } = useTranslation();
  const { user, loginWithGoogle } = useAuth();

  const {
    historyList,
    limit: historyLimit,
    clearHistory,
  } = useStationHistory(trainType);
  const {
    favoriteList,
    limit: favoriteLimit,
    addFavorite,
    removeFavorite,
    isFavorite,
  } = useStationFavorites(trainType);
  const stopCount = stopFavorites?.count ?? 0;

  const [showHistory] = useSetting("showHistory");
  const [showFavoriteRoutes] = useSetting("showFavoriteRoutes");
  const [showFavoriteStops] = useSetting("showFavoriteStops");
  const [defaultSearchTab] = useSetting("defaultSearchTab");
  const [preferBusStopTab] = useSetting("preferBusStopTab");

  const [loginOpen, setLoginOpen] = useState(false);
  const [limitOpen, setLimitOpen] = useState(false);

  // 文案依車種切「車站 / 路線」（歷史用語兩者皆通，僅常用 / 收藏需區分）
  const isStation = trainType === "TR";
  const favTabKey = isStation ? "favoritesStationTab" : "favoritesTab";
  const favEmptyKey = isStation
    ? "favoritesStationEmptyHint"
    : "favoritesEmptyHint";
  const favInquiryKey = isStation
    ? "favoritesStationInquiry"
    : "favoritesInquiry";
  const requiresLoginKey = isStation
    ? "favoriteStationRequiresLogin"
    : "favoriteRequiresLogin";
  const limitReachedKey = isStation
    ? "favoriteStationLimitReached"
    : "favoriteLimitReached";

  const labelOf = (item: StationTarget) =>
    resolveLabel?.(item) ?? item.targetName;

  const handleSelect = (item: StationTarget) => {
    gaClickEvent(GaEnum.HISTORY);
    onSelect({
      targetId: item.targetId,
      targetName: item.targetName,
      meta: item.meta,
    });
  };

  const handleClear = () => clearHistory();

  // 切換收藏：未登入跳登入引導；已收藏→移除；未收藏→加入（已滿跳上限提示）
  const handleToggleFavorite = (item: StationTarget) => {
    if (!user) {
      setLoginOpen(true);
      return;
    }
    const fav = isFavorite(item.targetId);
    gaClickEvent(fav ? GaEnum.UNFAVORITE_ROUTE : GaEnum.FAVORITE_ROUTE);
    if (fav) {
      removeFavorite(item.targetId);
    } else if (
      addFavorite({
        targetId: item.targetId,
        targetName: item.targetName,
        meta: item.meta,
      }) === "limit"
    ) {
      setLimitOpen(true);
    }
  };

  const tabTitle = (label: string, count: number, max: number) => (
    <span className="flex items-center gap-1">
      {label}
      <span className="text-xs text-zinc-400 dark:text-zinc-500">
        {count} / {max}
      </span>
    </span>
  );

  // 單列：名稱按鈕（點擊重查）+ 收藏愛心（showFavoriteRoutes 開啟時）。
  // 次要標籤（公車縣市/來源）以淡色接在名稱後，區分同名不同路線。
  const renderRow = (item: StationTarget) => {
    const fav = showFavoriteRoutes && isFavorite(item.targetId);
    const subLabel = resolveSubLabel?.(item);
    return (
      <div className="relative" key={item.targetId}>
        <Button
          className="h-8 w-full bg-secondary text-sm text-secondary-foreground"
          size="sm"
          radius="sm"
          onPress={() => handleSelect(item)}
        >
          {/* 名稱過長以 … 截斷（保留前段路線號）；縣市/來源副標 shrink-0 永不被截。
              TR/THSR/TYMC 名稱短、不會觸及上限，維持原樣 */}
          <span className="flex w-full items-center justify-center gap-1.5 overflow-hidden">
            <span className="min-w-0 truncate">{labelOf(item)}</span>
            {subLabel && (
              <span className="shrink-0 text-xs text-white/70">{subLabel}</span>
            )}
          </span>
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
            onClick={() => handleToggleFavorite(item)}
          >
            <HeartIcon filled={fav} className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  };

  // 清單本體：等寬單欄；歷史附清除鈕，常用不附
  const renderList = (items: StationTarget[], withClear: boolean) => (
    <div className="flex max-w-[10rem] flex-col gap-2.5">
      {items.map(renderRow)}
      {withClear && (
        <div className="flex justify-center">
          <CloseButton onClick={handleClear} />
        </div>
      )}
    </div>
  );

  const favoriteDialogs = (
    <>
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
        {t(requiresLoginKey)}
      </CommonDialog>

      <CommonDialog
        open={limitOpen}
        setOpen={setLimitOpen}
        title="favoriteLimitTitle"
        confirmText="gotItLabel"
      >
        {t(limitReachedKey, { max: favoriteLimit })}
      </CommonDialog>
    </>
  );

  const emptyHint = (text: string, spacing = "px-4") => (
    <p className={`${spacing} text-sm text-zinc-400 dark:text-zinc-500`}>
      {text}
    </p>
  );

  // 可用分頁與版面由 registry 決定；可用性只看設定與該頁是否具備，與有無資料無關
  const scope = SCOPE_BY_TRAIN_TYPE[trainType];
  const availableTabs = getAvailableTabs(
    scope,
    { showHistory, showFavoriteRoutes, showFavoriteStops },
    { stopFavorites: !!stopFavorites },
  );
  const layout = getPanelLayout(availableTabs);
  // 站牌分頁在場且使用者選了優先 → 覆寫通用設定；否則一律跟隨通用設定
  const selectedTab = resolveDefaultTab(
    preferBusStopTab && availableTabs.includes("stopFavorites")
      ? "stopFavorites"
      : defaultSearchTab,
    availableTabs,
  );

  const tabViews: Partial<Record<SearchPanelTabKey, SearchPanelTabView>> = {
    history: {
      label: t("historyTab"),
      count: historyList.length,
      max: historyLimit,
      inquiryTitle: t("historyInquiry", {
        nowLength: historyList.length,
        max: historyLimit,
      }),
      emptyNode: emptyHint(t("historyEmptyHint"), "px-4 py-2"),
      list: renderList(historyList, true),
    },
    favorites: {
      label: t(favTabKey),
      count: favoriteList.length,
      max: favoriteLimit,
      inquiryTitle: t(favInquiryKey, {
        nowLength: favoriteList.length,
        max: favoriteLimit,
      }),
      emptyNode: emptyHint(t(favEmptyKey)),
      list: renderList(favoriteList, false),
    },
    stopFavorites: stopFavorites
      ? {
          label: t("favoritesStopTab"),
          count: stopCount,
          max: favoriteLimit,
          inquiryTitle: t("favoritesStopInquiry", {
            nowLength: stopCount,
            max: favoriteLimit,
          }),
          emptyNode: emptyHint(t("favoritesStopEmptyHint")),
          list: stopFavorites.content,
          flatWrapList: false,
          tabBodyClass: stopCount > 0 ? "-mt-1" : "mt-1",
        }
      : undefined,
  };

  if (layout === "none") return null;

  // 可用分頁全無資料 → 整塊不顯示
  const filled = availableTabs.filter((tab) => tabViews[tab]!.count > 0);
  if (filled.length === 0) return null;

  // 單一分頁 → 標題 + 內容直接呈現（無分頁列）
  if (layout === "flat") {
    const view = tabViews[availableTabs[0]]!;
    return (
      <>
        <div className="text-center">
          <div className="mb-2.5 text-sm text-muted-foreground">
            {view.inquiryTitle}
          </div>
          {view.flatWrapList !== false ? (
            <div className="flex justify-center">{view.list}</div>
          ) : (
            view.list
          )}
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
        aria-label="歷史查詢與常用"
        size="md"
        variant="underlined"
        classNames={{
          // 限寬 + 換行：預設 inline-flex 無寬度上界，長標籤（英文）會撐出整頁水平捲動；
          // 解除預設 overflow-x-scroll 的裁切，tab 改 w-auto 才不會每個獨佔一列
          base: "w-full",
          tabList:
            "w-full flex-wrap justify-center gap-x-0 gap-y-1 !overflow-visible",
          cursor: "h-px scale-x-110",
          tab: "!w-auto data-[hover-unselected=true]:opacity-100 px-2",
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

export default StationHistoryPanel;
