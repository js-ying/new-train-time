import { useCallback, useRef, useState } from "react";

interface UseRefreshCooldownResult {
  /** 嘗試執行 action：未冷卻→執行並起算冷卻；冷卻中→開彈窗顯示凍結剩餘秒數、不執行。
   *  傳 key 作「同查詢」判定（同 key 才擋，不同 key 視為新查詢直接放行）；不傳 key 即單一冷卻。 */
  attempt: (action: () => void, key?: string) => void;
  /** 冷卻彈窗開關 */
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  /** 被擋下當下凍結的剩餘秒數（彈窗顯示用，不即時倒數） */
  frozenSeconds: number;
  /** 重置冷卻（如切換查詢對象，新對象可立即刷新） */
  reset: () => void;
}

/**
 * 手動刷新冷卻：冷卻中再按 → 彈窗提示「請於 X 秒後再試」（凍結秒數），比照 OD/單站 sameQuery。
 * 按鈕本身不 disable，攔截與提示都在這裡；秒數於被擋當下算一次並凍結。
 */
export const useRefreshCooldown = (
  intervalMs: number,
): UseRefreshCooldownResult => {
  // 上次查詢的 key 與時間；key 用於「同查詢」判定（不同 key 視為不同查詢、不擋）
  const lastRef = useRef<{ key: string | undefined; time: number } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [frozenSeconds, setFrozenSeconds] = useState(0);

  const attempt = useCallback(
    (action: () => void, key?: string) => {
      const now = Date.now();
      const last = lastRef.current;
      if (last != null && last.key === key && now - last.time < intervalMs) {
        // 凍結被擋當下的剩餘秒數（無條件進位，至少 1 秒）
        setFrozenSeconds(
          Math.max(1, Math.ceil((last.time + intervalMs - now) / 1000)),
        );
        setDialogOpen(true);
        return;
      }
      lastRef.current = { key, time: now };
      action();
    },
    [intervalMs],
  );

  const reset = useCallback(() => {
    lastRef.current = null;
  }, []);

  return { attempt, dialogOpen, setDialogOpen, frozenSeconds, reset };
};

export default useRefreshCooldown;
