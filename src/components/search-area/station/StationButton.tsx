import { Button } from "@heroui/react";
import { FC } from "react";

interface StationButtonProps {
  text: string;
  onClick: () => void;
  isTopStation?: boolean;
}

/** 車站按鈕 */
const StationButton: FC<StationButtonProps> = ({
  text,
  onClick,
  isTopStation,
}) => {
  return (
    <Button
      className={`text-md h-auto min-h-10 whitespace-pre-line text-white
        ${
          isTopStation
            ? "bg-gradient-to-r from-silverLakeBlue-300 via-silverLakeBlue-500 to-silverLakeBlue-300 dark:from-gamboge-400 dark:via-gamboge-600 dark:to-gamboge-400"
            : "bg-neutral-500 dark:bg-neutral-600"
        }`}
      radius="sm"
      onPress={onClick}
    >
      {text}
    </Button>
  );
};

export default StationButton;
