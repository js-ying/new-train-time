import { createContext, FC, ReactNode, useState } from "react";

export type SearchMode = "direct" | "transfer";

interface SearchModeContextValue {
  /** 使用者在 tab 上選的暫存 mode；按搜尋按鈕後才寫入 URL，不會觸發即時 fetch */
  draftMode: SearchMode;
  setDraftMode: (mode: SearchMode) => void;
}

export const SearchModeContext = createContext<SearchModeContextValue>({
  draftMode: "direct",
  setDraftMode: () => {},
});

interface SearchModeProviderProps {
  children: ReactNode;
}

/**
 * 提供「draft mode」狀態：tab 切換暫存值，跟 URL mode 解耦。
 * URL mode 才是 fetch / render 的真實來源（由 useSearchMode 從 router.query 推導），
 * draft 只決定 tab 視覺與 SearchButton 按下後要寫入 URL 的值。
 */
export const SearchModeProvider: FC<SearchModeProviderProps> = ({ children }) => {
  const [draftMode, setDraftMode] = useState<SearchMode>("direct");
  return (
    <SearchModeContext.Provider value={{ draftMode, setDraftMode }}>
      {children}
    </SearchModeContext.Provider>
  );
};
