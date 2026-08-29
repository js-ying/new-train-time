import { ReactNode } from "react";

/**
 * 查詢面板（OD 搜尋區 / 單站・公車面板）的分頁宣告：
 * 各面板有哪些分頁、分頁受哪個開關控制、預設分頁不可用時退到誰
 */

/** 分頁識別碼 */
export type SearchPanelTabKey = "history" | "favorites" | "stopFavorites";

/** 控制分頁顯示的設定開關；一個分頁對應一個開關，開關同時決定該類收藏能不能新增 */
export type SearchPanelToggle =
  | "showHistory"
  | "showFavoriteRoutes"
  | "showFavoriteStops";

/** 面板種類；trStation 與 bus 共用同一個元件，分頁全集不同 */
export type SearchPanelScope = "od" | "trStation" | "bus";

interface SearchPanelTabDescriptor {
  toggle: SearchPanelToggle;
  /** 此分頁不可用時預設分頁退到誰；沿鏈往下找，最終必達 history */
  fallbackTo?: SearchPanelTabKey;
}

const TAB_REGISTRY: Record<SearchPanelTabKey, SearchPanelTabDescriptor> = {
  history: { toggle: "showHistory" },
  favorites: { toggle: "showFavoriteRoutes", fallbackTo: "history" },
  stopFavorites: { toggle: "showFavoriteStops", fallbackTo: "favorites" },
};

/** 各面板的分頁全集與顯示順序 */
const SCOPE_TABS: Record<SearchPanelScope, readonly SearchPanelTabKey[]> = {
  od: ["history", "favorites"],
  trStation: ["history", "favorites"],
  bus: ["history", "favorites", "stopFavorites"],
};

/** 面板版面：無可用分頁 / 單一分頁直接呈現 / 多分頁 */
export type SearchPanelLayout = "none" | "flat" | "tabs";

/**
 * 算出面板當下可用的分頁。
 * 只反映「開關與該頁是否具備此分頁」，不含「有無資料」——空清單仍是可用分頁（顯示空狀態提示）。
 * @param toggles 三個顯示開關的現值
 * @param tabPresent 該頁是否具備某分頁（未列出者視為具備）
 */
export function getAvailableTabs(
  scope: SearchPanelScope,
  toggles: Record<SearchPanelToggle, boolean>,
  tabPresent?: Partial<Record<SearchPanelTabKey, boolean>>,
): SearchPanelTabKey[] {
  return SCOPE_TABS[scope].filter(
    (tab) => toggles[TAB_REGISTRY[tab].toggle] && tabPresent?.[tab] !== false,
  );
}

/** 依可用分頁數決定版面：0 不顯示、1 直接呈現（無分頁列）、2 以上分頁 */
export function getPanelLayout(
  availableTabs: SearchPanelTabKey[],
): SearchPanelLayout {
  if (availableTabs.length === 0) return "none";
  return availableTabs.length === 1 ? "flat" : "tabs";
}

/** 該面板是否有通用面板（od）沒有的分頁，且不只一個分頁 */
export function hasScopeSpecificTab(
  scope: SearchPanelScope,
  availableTabs: SearchPanelTabKey[],
): boolean {
  if (availableTabs.length < 2) return false;
  return availableTabs.some((tab) => !SCOPE_TABS.od.includes(tab));
}

/**
 * 把使用者偏好的預設分頁收斂成當下可用的分頁：
 * 沿 fallbackTo 鏈找第一個可用者（常用站牌 → 常用 → 歷史）
 */
export function resolveDefaultTab(
  preferred: SearchPanelTabKey,
  availableTabs: SearchPanelTabKey[],
): SearchPanelTabKey | undefined {
  let tab: SearchPanelTabKey | undefined = preferred;
  while (tab) {
    if (availableTabs.includes(tab)) return tab;
    tab = TAB_REGISTRY[tab].fallbackTo;
  }
  return availableTabs[0];
}

/**
 * 單一分頁的呈現材料，由各面板提供。
 * 新增分頁時：此檔補宣告 + 面板補一筆 view + i18n 補文案，版面判斷不必跟著改
 */
export interface SearchPanelTabView {
  /** 分頁列標籤 */
  label: string;
  /** 資料筆數；0 在分頁模式顯示空狀態，單一分頁時整塊不顯示 */
  count: number;
  /** 筆數上限（分頁列的 X / Y） */
  max: number;
  /** 單一分頁模式的標題（含計數） */
  inquiryTitle: string;
  /** 分頁模式無資料時的提示節點 */
  emptyNode: ReactNode;
  /** 清單本體（不含置中容器） */
  list: ReactNode;
  /** 單一分頁模式是否以置中容器包住 list；預設 true，外部注入的看板才關掉 */
  flatWrapList?: boolean;
  /** 分頁模式內容容器的間距 class；預設 mt-1 */
  tabBodyClass?: string;
}
