/**
 * 公車首頁 → 查詢頁之間傳遞「主動選擇」：查詢頁據此寫歷史、捲到指定站。
 * 存在 module 內，站內導頁期間保留；整頁載入即清空，直連 / 冷開自然不算主動選擇。
 */
import type { BusRouteStopHighlight } from "@/components/bus/BusRouteBoard";
import { JsyBusRoute } from "@/models/jsy-bus-info";

export interface PendingBusSelection {
  /** encodeBusTargetId(routeUid, subRouteName) */
  key: string;
  /** 選擇當下的路線物件（搜尋候選含起訖）；熱門藥丸不帶，查詢頁改由網址還原 */
  route?: JsyBusRoute;
  /** 收藏站點點入時要捲到的站 */
  highlight?: BusRouteStopHighlight;
}

let pending: PendingBusSelection | null = null;

/** 記下首頁的主動選擇（導頁前呼叫） */
export const setPendingBusSelection = (selection: PendingBusSelection) => {
  pending = selection;
};

/** 取出並清除主動選擇；與 key 不符回 null */
export const takePendingBusSelection = (
  key: string,
): PendingBusSelection | null => {
  const selection = pending;
  pending = null;
  return selection?.key === key ? selection : null;
};
