import { Select, SelectItem } from "@heroui/react";
import { useTranslation } from "next-i18next";
import { FC, useMemo } from "react";

interface TrTransferLegCountFilterProps {
  /** 資料中實際出現過的段數（動態組裝選項，避免出現「3 段」但其實沒資料） */
  availableLegCounts: number[];
  /** 目前選擇的段數；null 代表「所有段數」 */
  selectedLegCount: number | null;
  onLegCountChange: (count: number | null) => void;
  /** 外層 base wrapper className（含寬度、grid col-span 等） */
  className?: string;
}

/**
 * [台鐵] 轉乘段數下拉篩選。
 * 通常只有 2 段 / 3 段；availableLegCounts 由 Table 從 combinations 推導，
 * 沒有 3 段資料時就不顯示「3 段」選項，避免空篩選。
 */
const TrTransferLegCountFilter: FC<TrTransferLegCountFilterProps> = ({
  availableLegCounts,
  selectedLegCount,
  onLegCountChange,
  className = "w-32",
}) => {
  const { t } = useTranslation();

  const options = useMemo(
    () => [
      {
        key: "all",
        label: t("transferLegCountAll"),
        value: null as number | null,
      },
      // legs.length 換算實際「轉乘次數」(count - 1)：2 段 = 1 次轉乘、3 段 = 2 次轉乘
      ...availableLegCounts.map((count) => ({
        key: `legs-${count}`,
        label: t("transferLegCountN", { count: count - 1 }),
        value: count as number | null,
      })),
    ],
    [t, availableLegCounts],
  );

  const currentKey = useMemo(() => {
    const found = options.find((o) => o.value === selectedLegCount);
    return found?.key ?? "all";
  }, [options, selectedLegCount]);

  return (
    <Select
      size="sm"
      aria-label={t("transferLegCountFilterLabel")}
      selectedKeys={[currentKey]}
      onSelectionChange={(keys) => {
        const key = Array.from(keys)[0] as string | undefined;
        if (!key) return;
        const next = options.find((o) => o.key === key)?.value ?? null;
        onLegCountChange(next);
      }}
      classNames={{
        // 預設 w-32 容納「不限轉乘次數」/「Any transfer count」+ icon；
        // Table 層可改傳 grid col-span + 響應式寬度做手機配比
        base: className,
        // bg-background + text-foreground：light 白底黑字、dark 深底白字。
        // border 顏色對齊 common-input 的 border-zinc-300；
        // dark hover 用 zinc-600（default-100 在 dark 跟背景太接近 hover 不明顯）
        trigger:
          "h-8 min-h-fit bg-background text-foreground border border-zinc-300 dark:border-zinc-500 data-[hover=true]:bg-default-100 dark:data-[hover=true]:bg-zinc-600",
        value: "text-sm",
        // 下拉開啟後的選項面板：跟 trigger 一致用 background；dark 加 border 拉開層次
        popoverContent:
          "bg-background border border-zinc-300 dark:border-zinc-500",
      }}
    >
      {options.map((opt) => (
        <SelectItem key={opt.key}>{opt.label}</SelectItem>
      ))}
    </Select>
  );
};

export default TrTransferLegCountFilter;
