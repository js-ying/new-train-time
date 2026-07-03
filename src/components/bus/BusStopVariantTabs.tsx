import { JsyBusStopVariant } from "@/models/jsy-bus-info";
import { Tab, Tabs } from "@heroui/react";
import { useTranslation } from "next-i18next";
import { FC } from "react";

interface BusStopVariantTabsProps {
  variants: JsyBusStopVariant[];
  currentStopUid: string;
  onSelect: (stopUid: string) => void;
}

/**
 * [公車] 同名多座標的站柱 tab：切到正確那根柱（如「消防局(松仁)」不同方向柱）。
 * 標籤用站牌地址 + 方位（i18n），無地址則退站名。沿用路線頁方向 pill Tabs 樣式。
 */
const BusStopVariantTabs: FC<BusStopVariantTabsProps> = ({
  variants,
  currentStopUid,
  onSelect,
}) => {
  const { t } = useTranslation();
  const labelFor = (v: JsyBusStopVariant): string => {
    const dir = v.bearing
      ? t(`busBearing.${v.bearing}`, { defaultValue: v.bearing })
      : "";
    const base = v.address || v.stopName;
    return dir ? `${base}·${dir}` : base;
  };
  return (
    <div className="mb-3 flex justify-center">
      <Tabs
        aria-label={t("busStopVariants")}
        variant="solid"
        radius="full"
        size="sm"
        classNames={{
          tabList: "!bg-transparent flex-wrap",
          cursor:
            "!bg-transparent !border border-zinc-700 dark:!border-zinc-200 !shadow-none",
          tab: "data-[hover-unselected=true]:opacity-100",
          tabContent:
            "group-data-[hover-unselected=true]:text-zinc-600 dark:group-data-[hover-unselected=true]:text-zinc-300",
        }}
        selectedKey={currentStopUid}
        onSelectionChange={(key) => onSelect(String(key))}
      >
        {variants.map((v) => (
          <Tab key={v.stopUid} title={labelFor(v)} />
        ))}
      </Tabs>
    </div>
  );
};

export default BusStopVariantTabs;
