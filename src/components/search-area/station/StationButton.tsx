import { Button } from "@heroui/react";
import { memo } from "react";

interface StationButtonProps {
  text: string;
  /** 點選時回傳的識別值（站號或縣市名），交由穩定的 onSelect 處理，避免每列各帶一個新 closure */
  value: string;
  onSelect: (value: string) => void;
  isTopStation?: boolean;
}

/**
 * 車站按鈕
 * 以 React.memo 包裹：車站清單在每次按鍵 / context 變動時會整批重渲染，
 * 只要 text/value/onSelect/isTopStation 不變，存活的按鈕即可 bail out 不再 reconcile，
 * 這是降低車站選單 INP 的關鍵（onSelect 需由呼叫端以 useCallback 穩定）。
 */
const StationButton = memo(function StationButton({
  text,
  value,
  onSelect,
  isTopStation,
}: StationButtonProps) {
  return (
    <Button
      className={`text-md h-auto min-h-10 whitespace-pre-line text-white
        ${
          isTopStation
            ? "bg-gradient-to-r from-silverLakeBlue-300 via-silverLakeBlue-500 to-silverLakeBlue-300 dark:from-gamboge-400 dark:via-gamboge-600 dark:to-gamboge-400"
            : "bg-neutral-500 dark:bg-neutral-600"
        }`}
      radius="sm"
      onPress={() => onSelect(value)}
    >
      {text}
    </Button>
  );
});

export default StationButton;
