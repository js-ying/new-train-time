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
        border-1 border-zinc-700 data-[hover=true]:bg-zinc-700
        data-[hover]:text-white dark:border-zinc-200 dark:data-[hover=true]:bg-silverLakeBlue-500
        ${isActive && " bg-zinc-700 text-white dark:bg-silverLakeBlue-500"}
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
