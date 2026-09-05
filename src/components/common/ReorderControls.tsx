import { Button } from "@heroui/react";
import { useTranslation } from "next-i18next";
import { FC } from "react";

/** 排序入口 icon：上下雙箭頭 */
const ArrowsUpDown: FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className="size-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
    />
  </svg>
);

/** 上 / 下箭頭（chevron）；顏色由外層 text-* 控制 */
const Chevron: FC<{ up: boolean }> = ({ up }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="size-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d={up ? "m4.5 15.75 7.5-7.5 7.5 7.5" : "m19.5 8.25-7.5 7.5-7.5-7.5"}
    />
  </svg>
);

interface ReorderArrowsProps {
  /** 該列在清單中的位置 */
  index: number;
  /** 清單總筆數（決定末列的下移是否可用） */
  total: number;
  onMove: (index: number, direction: -1 | 1) => void;
  /** 直排（置於公車卡片外側，省寬度且方向與語意對應）／預設橫排（站名列僅 h-8） */
  vertical?: boolean;
}

/** 排序模式的單列上下移按鈕；已在端點的方向自動 disabled */
export const ReorderArrows: FC<ReorderArrowsProps> = ({
  index,
  total,
  onMove,
  vertical = false,
}) => {
  const { t } = useTranslation();
  const btnClass = "size-8 min-w-8 text-zinc-600 dark:text-zinc-300";
  return (
    <div className={`flex ${vertical ? "flex-col" : "flex-row"} items-center`}>
      <Button
        isIconOnly
        size="sm"
        radius="sm"
        variant="light"
        className={btnClass}
        aria-label={t("moveUpLabel")}
        isDisabled={index === 0}
        onPress={() => onMove(index, -1)}
      >
        <Chevron up />
      </Button>
      <Button
        isIconOnly
        size="sm"
        radius="sm"
        variant="light"
        className={btnClass}
        aria-label={t("moveDownLabel")}
        isDisabled={index === total - 1}
        onPress={() => onMove(index, 1)}
      >
        <Chevron up={false} />
      </Button>
    </div>
  );
};

interface ReorderToolbarProps {
  isReordering: boolean;
  onStart: () => void;
  onSave: () => void;
  onCancel: () => void;
}

/** 清單下方的排序入口；排序中換成「完成 / 取消」 */
export const ReorderToolbar: FC<ReorderToolbarProps> = ({
  isReordering,
  onStart,
  onSave,
  onCancel,
}) => {
  const { t } = useTranslation();
  const btnClass = "h-7 min-w-fit px-2 text-xs";

  if (!isReordering) {
    return (
      <div className="flex justify-center">
        <Button
          isIconOnly
          size="sm"
          radius="sm"
          variant="light"
          className="size-8 min-w-8 text-zinc-400 dark:text-zinc-500"
          aria-label={t("reorderLabel")}
          onPress={onStart}
        >
          <ArrowsUpDown />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-1">
      <Button
        size="sm"
        radius="sm"
        variant="light"
        className={`${btnClass} text-muted-foreground`}
        onPress={onCancel}
      >
        {t("cancel")}
      </Button>
      <Button
        size="sm"
        radius="sm"
        color="primary"
        className={btnClass}
        onPress={onSave}
      >
        {t("reorderDoneLabel")}
      </Button>
    </div>
  );
};
