import { Button } from "@heroui/react";
import { FC } from "react";

interface CalloutBannerProps {
  title: string;
  description: string;
  /** CTA 按鈕文字 */
  actionLabel: string;
  onAction: () => void;
}

/**
 * [元件] 行動引導 banner：主題色底 + 標題說明 + 一顆 CTA
 * 語意有別於 CommonAlert（狀態告知），此元件用於促成使用者動作
 */
const CalloutBanner: FC<CalloutBannerProps> = ({
  title,
  description,
  actionLabel,
  onAction,
}) => (
  <div className="flex items-center justify-between gap-3 rounded-xl border border-primary/40 bg-primary/5 p-4">
    <div className="flex min-w-0 flex-col gap-0.5">
      <p className="text-sm font-semibold text-primary">{title}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    <Button
      color="primary"
      size="sm"
      className="shrink-0 text-sm font-medium"
      onPress={onAction}
    >
      {actionLabel}
    </Button>
  </div>
);

export default CalloutBanner;
