import { createContext } from "react";

/**
 * 送出時可覆寫的查詢欄位。
 * 給「現在」按鈕帶入它剛設定、但 context 尚未更新到的日期時間。
 */
export interface SubmitOverrides {
  date?: string;
  time?: string;
}

export type SubmitSearch = (overrides?: SubmitOverrides) => void;

/**
 * 由 SearchArea 提供，讓搜尋按鈕與「現在」共用同一份送出邏輯，
 * 5 秒同筆查詢節流與提示彈窗因此只有一份，不會互相繞過。
 */
export const SearchSubmitContext = createContext<SubmitSearch>(null);
