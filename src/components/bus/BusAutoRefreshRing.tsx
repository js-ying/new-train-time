import { CircularProgress } from "@heroui/react";
import { useTranslation } from "next-i18next";
import { FC, useEffect, useState } from "react";

interface BusAutoRefreshRingProps {
  /** 下次自動刷新的時間戳（毫秒） */
  nextUpdateAt: number;
  /** 輪詢間隔（毫秒），用來換算進度比例 */
  intervalMs: number;
}

/**
 * [公車] 自動輪詢倒數環：環隨剩餘時間遞減，走完一圈即刷新（獨立計時、不重繪整頁列表）。
 */
const BusAutoRefreshRing: FC<BusAutoRefreshRingProps> = ({
  nextUpdateAt,
  intervalMs,
}) => {
  const { t } = useTranslation();
  const [, tick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 200);
    return () => clearInterval(id);
  }, []);

  // 剩餘比例 → 環值（遞減＝倒數）；刷新後 nextUpdateAt 往後跳、環自動補滿
  const remaining = Math.max(0, nextUpdateAt - Date.now());
  const value = Math.min(100, (remaining / intervalMs) * 100);

  return (
    <CircularProgress
      size="sm"
      value={value}
      strokeWidth={4}
      color="success"
      aria-label={t("busAutoRefreshHintTitle")}
      classNames={{
        svg: "h-5 w-5",
        indicator: "stroke-emerald-500",
        track: "stroke-emerald-500/20",
      }}
    />
  );
};

export default BusAutoRefreshRing;
