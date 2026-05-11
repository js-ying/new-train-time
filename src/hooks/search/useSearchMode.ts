import { SearchMode, SearchModeContext } from "@/contexts/SearchModeContext";
import { useRouter } from "next/router";
import { useContext, useEffect, useMemo } from "react";

export type { SearchMode };

interface UseSearchModeResult {
  /** URL mode：fetch / 渲染依據。由 router.query.m 推導，唯有 SearchButton router.push 時才會變 */
  mode: SearchMode;
  isTransfer: boolean;
  /** Draft mode：tab 切換暫存值。改變不會立即觸發 fetch / URL 變更 */
  draftMode: SearchMode;
  setDraftMode: (mode: SearchMode) => void;
}

/**
 * 搜尋模式雙軌：
 *   - mode（URL 推導）：實際資料來源。useTrainSearch / search.tsx 用它判斷打哪個 endpoint、渲染哪個版面。
 *   - draftMode（Context state）：tab 切換用，不立即觸發 fetch。SearchButton 按下時才把 draft 寫進 URL，
 *     URL mode 跟著變，useTrainSearch 才會 fetch 新 mode 的資料。
 *
 * URL mode 變化時自動同步 draftMode，避免使用者按搜尋後 tab 高亮位置反而錯亂。
 */
const useSearchMode = (): UseSearchModeResult => {
  const router = useRouter();
  const { draftMode, setDraftMode } = useContext(SearchModeContext);

  const mode: SearchMode = useMemo(() => {
    return router.query.m === "transfer" ? "transfer" : "direct";
  }, [router.query.m]);

  // URL mode 變化（router.push 後）強制把 draftMode 同步到 URL，避免兩者長期脫節
  useEffect(() => {
    setDraftMode(mode);
  }, [mode, setDraftMode]);

  return {
    mode,
    isTransfer: mode === "transfer",
    draftMode,
    setDraftMode,
  };
};

export default useSearchMode;
