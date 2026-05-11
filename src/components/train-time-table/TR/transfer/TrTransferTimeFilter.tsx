import { Select, SelectItem } from "@heroui/react";
import { useTranslation } from "next-i18next";
import { FC, useMemo } from "react";

interface TrTransferTimeFilterProps {
  /** 目前選擇的等待上限（Infinity 代表「全部」） */
  selectedLimit: number;
  /** 變更時回呼；Table 層集中組合多個 filter 條件 */
  onLimitChange: (limit: number) => void;
  /** 外層 base wrapper className（含寬度、grid col-span 等） */
  className?: string;
}

/**
 * [台鐵] 單次轉乘等待時間下拉篩選（仿台鐵官網級距）。
 * 篩選依據為「所有單次轉乘等待時間都不超過 limit」(every(w => w < limit))，
 * 不是加總；意即任一段等待過久就排除（19+45 在 <30 看不到，19+29 看得到）。
 *
 * controlled 元件：實際過濾邏輯由 Table 集中處理（與段數 filter 等共同套用）。
 */
const TrTransferTimeFilter: FC<TrTransferTimeFilterProps> = ({
  selectedLimit,
  onLimitChange,
  className = "w-48",
}) => {
  const { t } = useTranslation();

  const options = useMemo(
    () => [
      { key: "all", label: t("transferFilterAll"), limit: Infinity },
      { key: "under20", label: t("transferFilterUnder20"), limit: 20 },
      { key: "under30", label: t("transferFilterUnder30"), limit: 30 },
      { key: "under50", label: t("transferFilterUnder50"), limit: 50 },
    ],
    [t],
  );

  const currentKey = useMemo(() => {
    const found = options.find((o) => o.limit === selectedLimit);
    return found?.key ?? "all";
  }, [options, selectedLimit]);

  return (
    <Select
      size="sm"
      aria-label={t("transferFilterLabel")}
      selectedKeys={[currentKey]}
      onSelectionChange={(keys) => {
        const key = Array.from(keys)[0] as string | undefined;
        if (!key) return;
        const limit = options.find((o) => o.key === key)?.limit ?? Infinity;
        onLimitChange(limit);
      }}
      classNames={{
        // HeroUI Select 用 w-fit 會塌成 icon-only 寬度，必須由外層給顯式寬度。
        // 預設 w-48 容納最長 label「不限定轉乘時間」/「Each transfer < 50 min」；
        // Table 層可改傳 grid col-span + 響應式寬度做手機 60/40 配比
        base: className,
        // bg-background + text-foreground：light 白底黑字、dark 深底白字。
        // border 顏色對齊 common-input 的 border-zinc-300；
        // dark hover 用 zinc-600（default-100 在 dark 跟背景太接近 hover 不明顯）
        trigger:
          "h-8 min-h-fit bg-background text-foreground border border-zinc-300 data-[hover=true]:bg-default-100 dark:data-[hover=true]:bg-zinc-600",
        value: "text-sm",
        // 下拉開啟後的選項面板：跟 trigger 一致用 background；dark 加 border 拉開層次
        popoverContent:
          "bg-background border border-zinc-300 dark:border-zinc-600",
      }}
    >
      {options.map((opt) => (
        <SelectItem key={opt.key}>{opt.label}</SelectItem>
      ))}
    </Select>
  );
};

export default TrTransferTimeFilter;
