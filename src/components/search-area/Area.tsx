import { Button } from "@heroui/react";
import { FC, ReactNode } from "react";

interface AreaProps {
  children: ReactNode;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

/** 搜尋區域按鈕 */
const Area: FC<AreaProps> = ({
  children,
  isActive,
  onClick,
  className = "",
}) => {
  return (
    <Button
      color="default"
      variant="light"
      className={`${className} text-md min-h-16 flex-col items-center justify-center gap-0
        border-1 border-zinc-700 data-[hover=true]:bg-cta
        data-[hover]:text-cta-foreground dark:border-zinc-200
        ${isActive && " bg-cta text-cta-foreground"}
      `}
      onPress={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick();
        }
      }}
    >
      {children}
    </Button>
  );
};

export default Area;
