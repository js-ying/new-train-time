import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { FC } from "react";

interface TimeSelectProps {
  value: string;
  options: { key: string; label: string }[];
  onSelect: (val: string) => void;
}

/**
 * 時 / 分下拉選擇器。
 * 用 HeroUI Dropdown 而非 Select 的理由：
 *  1. 視覺只放兩位數字，不需要箭頭 indicator；Select 內建 selectorIcon 要強制隱藏會多 override。
 *  2. Select 預設 min-width / padding 大，壓到 ~48px 寬會壞掉；Dropdown trigger 可任意 size。
 * panel 樣式對齊 TrTransferTimeFilter 的 popoverContent（bg-background + zinc 邊框），
 * item hover 配色也同步對齊。
 */
const TimeSelect: FC<TimeSelectProps> = ({ value, options, onSelect }) => {
  return (
    <Dropdown
      placement="bottom"
      classNames={{
        // HeroUI Dropdown content 預設 min-w-[200px]，對只放兩位數字的 trigger 來說太寬。
        // 縮到 6rem (96px)，剛好容納雙位數字 + 左側打勾 icon + padding，與 trigger 寬度視覺較協調。
        // 注意：不要動 w-full，否則 inline-flex 在沒寬度父層下會塌掉。
        content:
          "!min-w-[6rem] bg-background border border-zinc-300 dark:border-zinc-500",
      }}
    >
      <DropdownTrigger>
        <Button
          variant="bordered"
          size="sm"
          radius="md"
          // 去掉 Button 預設較寬的 min-w，僅夠容納兩位數字；邊框色對齊 panel
          className="h-8 min-w-fit border border-zinc-300 px-2 text-foreground dark:border-zinc-500"
          aria-label="time-select"
        >
          {value}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="time options"
        selectionMode="single"
        selectedKeys={[value]}
        // onAction 傳入的 key 型別為 Key（string | number），轉 string 後丟回呼
        onAction={(key) => onSelect(String(key))}
        // max-h 必須加在 list slot（真正的 ul）而非 content slot：
        // 加在 content 會跟 React Aria 的 keyboard auto-scroll 衝突，導致滾不到頂只看到半截 item
        classNames={{
          list: "max-h-60 overflow-y-auto",
        }}
        itemClasses={{
          // 亮色 hover 用 zinc-50 與 TrTransferTimeFilter 一致；dark 用 zinc-700
          base: "data-[hover=true]:bg-zinc-50 dark:data-[hover=true]:bg-zinc-700",
        }}
      >
        {options.map((opt) => (
          <DropdownItem key={opt.key}>{opt.label}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default TimeSelect;
