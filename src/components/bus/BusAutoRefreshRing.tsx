import { Button, CircularProgress } from "@heroui/react";
import { useTranslation } from "next-i18next";
import { FC, useEffect, useState } from "react";

interface BusAutoRefreshRingProps {
  /** 下次自動刷新的時間戳（毫秒） */
  nextUpdateAt: number;
  /** 輪詢間隔（毫秒），用來換算進度比例 */
  intervalMs: number;
  /** 點擊立即更新；冷卻攔截由呼叫端處理 */
  onRefresh: () => void;
}

/**
 * [公車] 自動輪詢倒數環：環隨剩餘時間遞減，走完一圈即刷新（獨立計時、不重繪整頁列表）。
 * 點擊可提前刷新（刷新會重排輪詢，環隨即補滿）。
 */
const BusAutoRefreshRing: FC<BusAutoRefreshRingProps> = ({
  nextUpdateAt,
  intervalMs,
  onRefresh,
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
    // -m-1.5 抵銷按鈕內距，footprint 維持 20px（與收藏愛心、刷新鈕同中心）
    <Button
      isIconOnly
      size="sm"
      radius="full"
      variant="light"
      className="-m-1.5"
      aria-label={t("busAutoRefreshRingLabel")}
      onPress={onRefresh}
    >
      <CircularProgress
        size="sm"
        value={value}
        strokeWidth={4}
        color="success"
        aria-label={t("busAutoRefreshHintTitle")}
        classNames={{
          svg: "h-5 w-5",
          track: "stroke-success/20",
        }}
      />
    </Button>
  );
};

export default BusAutoRefreshRing;
