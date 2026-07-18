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
 * tab 文字 = label + 方位（i18n）；label 過長截斷，方位永遠顯示。
 */
const BusStopVariantTabs: FC<BusStopVariantTabsProps> = ({
  variants,
  currentStopUid,
  onSelect,
}) => {
  const { t } = useTranslation();
  const labelNode = (v: JsyBusStopVariant) => {
    const dir = v.bearing
      ? t(`busBearing.${v.bearing}`, { defaultValue: v.bearing })
      : "";
    return (
      <span className="flex items-center gap-0.5">
        <span className="block max-w-56 truncate">{v.label}</span>
        {dir && <span className="shrink-0">·{dir}</span>}
      </span>
    );
  };
  return (
    <div className="mb-3 flex justify-center">
      <Tabs
        aria-label={t("busStopVariants")}
        variant="solid"
        radius="full"
        size="sm"
        classNames={{
          // 解除 HeroUI 預設 overflow-x-scroll 的裁切；否則 flex-wrap 換行後，貼容器圓角的選中 tab border 會被削掉一角
          tabList: "!bg-transparent flex-wrap justify-center !overflow-visible",
          cursor:
            "!bg-transparent !border border-zinc-700 dark:!border-zinc-200 !shadow-none",
          // 覆寫 base 的 w-full：flex-wrap 下各 tab 會撐滿整列致 border 過寬，改 w-auto 貼齊文字
          tab: "!w-auto data-[hover-unselected=true]:opacity-100",
          tabContent:
            "group-data-[hover-unselected=true]:text-zinc-600 dark:group-data-[hover-unselected=true]:text-zinc-300",
        }}
        selectedKey={currentStopUid}
        onSelectionChange={(key) => onSelect(String(key))}
      >
        {variants.map((v) => (
          <Tab key={v.stopUid} title={labelNode(v)} />
        ))}
      </Tabs>
    </div>
  );
};

export default BusStopVariantTabs;
