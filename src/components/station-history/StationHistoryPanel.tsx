import { useAuth } from "@/contexts/AuthContext";
import { GaEnum } from "@/enums/GaEnum";
import useSetting from "@/hooks/useSetting";
import useStationFavorites from "@/hooks/useStationFavorites";
import useStationHistory from "@/hooks/useStationHistory";
import {
  MAX_STATION_FAVORITES,
  MAX_STOP_FAVORITES,
} from "@/models/station-favorites";
import {
  MAX_STATION_HISTORY,
  StationTarget,
  StationTrainType,
} from "@/models/station-history";
import { gaClickEvent } from "@/utils/GaUtils";
import { Button, Tab, Tabs } from "@heroui/react";
import { useTranslation } from "next-i18next";
import { FC, ReactNode, useState } from "react";
import CommonDialog from "../common/CommonDialog";
import HeartIcon from "../icons/HeartIcon";

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
 * 通用單點查詢「歷史 / 常用」面板（台鐵單站 / 公車路線共用）。
 * 對應 OD SearchHistory：依設定 showHistory / showFavoriteRoutes 切單清單或雙分頁，
 * 差別在資料為單一 target（站 / 路線），文案依車種切「車站 / 路線」。
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

  const { historyList, clearHistory } = useStationHistory(trainType);
  const { favoriteList, addFavorite, removeFavorite, isFavorite } =
    useStationFavorites(trainType);
  const stopCount = stopFavorites?.count ?? 0;

  const [showHistory] = useSetting("showHistory");
  const [showFavoriteRoutes] = useSetting("showFavoriteRoutes");
  const [defaultSearchTab] = useSetting("defaultSearchTab");

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

  // 單一清單型態（只開歷史或只開常用時）：標題 + 置中清單；歷史附清除鈕，常用不附
  const renderFlatList = (
    title: string,
    items: StationTarget[],
    withClear: boolean,
  ) => (
    <div className="text-center">
      <div className="mb-2.5 text-sm text-muted-foreground">
        {title}
      </div>
      <div className="flex justify-center">
        <div className="flex max-w-[10rem] flex-col gap-2.5">
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
        {t(limitReachedKey)}
      </CommonDialog>
    </>
  );

  // 兩者皆關 → 整塊不顯示
  if (!showHistory && !showFavoriteRoutes) return null;

  // 只開歷史：純歷史清單（無分頁、無愛心）
  if (showHistory && !showFavoriteRoutes) {
    if (historyList.length === 0) return null;
    return renderFlatList(
      t("historyInquiry", { nowLength: historyList.length }),
      historyList,
      true,
    );
  }

  // 只開常用：純常用清單（無分頁、含愛心）；有站點收藏時接在路線清單下
  if (!showHistory && showFavoriteRoutes) {
    if (favoriteList.length === 0 && stopCount === 0) return null;
    return (
      <>
        {favoriteList.length > 0 &&
          renderFlatList(
            t(favInquiryKey, { nowLength: favoriteList.length }),
            favoriteList,
            false,
          )}
        {stopCount > 0 && (
          <div
            className={`text-center ${favoriteList.length > 0 ? "mt-4" : ""}`}
          >
            <div className="mb-2.5 text-sm text-muted-foreground">
              {t("favoritesStopInquiry", { nowLength: stopCount })}
            </div>
            {stopFavorites?.content}
          </div>
        )}
        {favoriteDialogs}
      </>
    );
  }

  // 兩者皆開 → 雙分頁（公車頁另有站牌分頁）；全部皆空 → 整塊不顯示
  if (historyList.length === 0 && favoriteList.length === 0 && stopCount === 0)
    return null;

  return (
    <>
      <Tabs
        key={defaultSearchTab}
        defaultSelectedKey={defaultSearchTab}
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
        <Tab
          key="history"
          title={tabTitle(
            t("historyTab"),
            historyList.length,
            MAX_STATION_HISTORY,
          )}
        >
          <div className="mt-1 flex justify-center">
            {historyList.length > 0 ? (
              <div className="flex max-w-[10rem] flex-col gap-2.5">
                {historyList.map(renderRow)}
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

        <Tab
          key="favorites"
          title={tabTitle(
            t(favTabKey),
            favoriteList.length,
            MAX_STATION_FAVORITES,
          )}
        >
          <div className="mt-1 flex justify-center">
            {favoriteList.length > 0 ? (
              <div className="flex max-w-[10rem] flex-col gap-2.5">
                {favoriteList.map(renderRow)}
              </div>
            ) : (
              <p className="px-4 text-sm text-zinc-400 dark:text-zinc-500">
                {t(favEmptyKey)}
              </p>
            )}
          </div>
        </Tab>

        {stopFavorites ? (
          <Tab
            key="stopFavorites"
            title={tabTitle(
              t("favoritesStopTab"),
              stopCount,
              MAX_STOP_FAVORITES,
            )}
          >
            <div className="-mt-1 flex justify-center">
              {stopCount > 0 ? (
                stopFavorites.content
              ) : (
                <p className="px-4 text-sm text-zinc-400 dark:text-zinc-500">
                  {t("favoritesStopEmptyHint")}
                </p>
              )}
            </div>
          </Tab>
        ) : null}
      </Tabs>

      {favoriteDialogs}
    </>
  );
};

export default StationHistoryPanel;
