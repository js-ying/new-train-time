import { cn } from "@/utils/cn";
import { FC } from "react";

interface ChevronToggleIconProps {
  /** 展開時朝上（rotate-180），收合朝下 */
  expanded: boolean;
  /** 可覆寫尺寸等樣式（預設 size-5），透過 twMerge 解衝突 */
  className?: string;
}

/** 摺疊區塊共用的展開箭頭：收合朝下、展開朝上 */
const ChevronToggleIcon: FC<ChevronToggleIconProps> = ({
  expanded,
  className,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    className={cn(
      "size-5 stroke-foreground transition-transform",
      expanded && "rotate-180",
      className,
    )}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m19.5 8.25-7.5 7.5-7.5-7.5"
    />
  </svg>
);

export default ChevronToggleIcon;
