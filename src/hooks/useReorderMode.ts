import { useCallback, useState } from "react";

/**
 * 清單排序模式：進入時複製一份草稿，上下移只動草稿，儲存才提交。
 * 排序期間清單被其他來源改動（跨分頁同步 / server canonical）不影響草稿，
 * 提交只送 key 順序，由呼叫端對回當下實際清單。
 */
export const useReorderMode = <T>(
  items: T[],
  keyOf: (item: T) => string,
  onSave: (orderedKeys: string[]) => void,
) => {
  const [draft, setDraft] = useState<T[] | null>(null);

  const start = useCallback(() => setDraft(items), [items]);
  const cancel = useCallback(() => setDraft(null), []);

  /** 與相鄰項對調；已在端點則不動 */
  const move = useCallback((index: number, direction: -1 | 1) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const to = index + direction;
      if (to < 0 || to >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[to]] = [next[to], next[index]];
      return next;
    });
  }, []);

  const save = useCallback(() => {
    if (draft) onSave(draft.map(keyOf));
    setDraft(null);
  }, [draft, keyOf, onSave]);

  return {
    isReordering: draft !== null,
    /** 要渲染的清單：排序中為草稿，否則為實際清單 */
    list: draft ?? items,
    start,
    cancel,
    move,
    save,
  };
};

export default useReorderMode;
