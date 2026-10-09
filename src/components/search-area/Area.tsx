import { Button } from "@heroui/react";
import { FC, ReactNode } from "react";

interface AreaProps {
  children: ReactNode;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

/** 搜尋區域按鈕（可隨內容增高；需換行的子元素自行加 whitespace-normal） */
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
      className={`${className} text-md h-auto min-h-16 min-w-0 flex-col items-center justify-center gap-0
        py-2 text-center
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
