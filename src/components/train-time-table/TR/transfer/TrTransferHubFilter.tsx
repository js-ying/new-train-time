import { Select, SelectItem } from "@heroui/react";
import { useTranslation } from "next-i18next";
import { FC, useMemo } from "react";

/** 下拉的一個轉乘站選項 */
export interface HubOption {
  id: string;
  name: string;
  count: number;
}

interface TrTransferHubFilterProps {
  /** 資料中實際出現過的轉乘站（含方案數），由 Table 從 combinations 推導 */
  availableHubs: HubOption[];
  /** 該 OD 是否有預設轉乘站；有才顯示「預設轉乘站」選項 */
  hasDefaultHubs: boolean;
  /** 目前選擇：'default' = 預設轉乘站、'all' = 不限、其餘為站號 */
  selectedHub: string;
  onHubChange: (value: string) => void;
  className?: string;
}

/**
 * [台鐵] 轉乘站下拉篩選。
 * 把資料中可轉乘的站列出來供選擇；有預設轉乘站時停在該組，選「不限轉乘站」
 * 或單一站即可查看其他組合。
 */
const TrTransferHubFilter: FC<TrTransferHubFilterProps> = ({
  availableHubs,
  hasDefaultHubs,
  selectedHub,
  onHubChange,
  className = "w-40",
}) => {
  const { t } = useTranslation();

  const options = useMemo(
    () => [
      ...(hasDefaultHubs
        ? [{ key: "default", label: t("transferHubDefault") }]
        : []),
      { key: "all", label: t("transferHubAll") },
      ...availableHubs.map((h) => ({
        key: h.id,
        label: `${h.name} (${h.count})`,
      })),
    ],
    [t, availableHubs, hasDefaultHubs],
  );

  const currentKey = options.some((o) => o.key === selectedHub)
    ? selectedHub
    : "all";

  return (
    <Select
      size="sm"
      aria-label={t("transferHubFilterLabel")}
      selectedKeys={[currentKey]}
      onSelectionChange={(keys) => {
        const key = Array.from(keys)[0] as string | undefined;
        if (key) onHubChange(key);
      }}
      classNames={{
        base: className,
        trigger:
          "group h-8 min-h-fit bg-background text-foreground border border-input transition-colors duration-200 data-[hover=true]:bg-cta data-[hover=true]:text-cta-foreground data-[hover=true]:border-cta",
        value:
          "text-sm transition-colors duration-200 group-data-[hover=true]:text-cta-foreground",
        popoverContent: "bg-background border border-input",
      }}
    >
      {options.map((opt) => (
        <SelectItem
          key={opt.key}
          classNames={{
            base: "data-[hover=true]:bg-muted data-[selectable=true]:focus:bg-muted",
          }}
        >
          {opt.label}
        </SelectItem>
      ))}
    </Select>
  );
};

export default TrTransferHubFilter;
