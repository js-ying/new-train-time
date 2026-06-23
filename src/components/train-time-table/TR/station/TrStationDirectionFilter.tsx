import { JsyTrStationDirection } from "@/models/jsy-tr-info";
import { getNameLangKey } from "@/utils/LocaleUtils";
import { Tab, Tabs } from "@heroui/react";
import { useTranslation } from "next-i18next";
import { FC } from "react";

interface TrStationDirectionFilterProps {
  directions: JsyTrStationDirection[];
  /** 0 順行(北上) / 1 逆行(南下) */
  value: number;
  onChange: (value: number) => void;
}

/**
 * [台鐵] 單站方向篩選（前端篩選，無「全部」— 單站必看單一方向）。
 * 採與搜尋區直達/轉乘一致的 pill Tabs 樣式並置中。
 * 標籤自適應：西部主線顯示北上/南下；支線/南迴/東部顯示往⟨終點⟩。
 * 只列出有班次的方向（terminals 非空）。
 */
const TrStationDirectionFilter: FC<TrStationDirectionFilterProps> = ({
  directions,
  value,
  onChange,
}) => {
  const { t, i18n } = useTranslation();
  const langKey = getNameLangKey(i18n.language);

  const labelFor = (d: JsyTrStationDirection): string => {
    if (d.showNorthSouth) {
      return t(
        d.northSouth === "north"
          ? "trStationBoardNorthbound"
          : "trStationBoardSouthbound",
      );
    }
    return t("trStationBoardTowards", {
      terminal: d.terminals.map((n) => n[langKey]).join(t("comma")),
    });
  };

  const options = directions.filter((d) => d.terminals.length > 0);

  return (
    <div className="flex justify-center">
      <Tabs
        variant="solid"
        radius="full"
        size="md"
        classNames={{
          tabList: "!bg-transparent",
          cursor:
            "!bg-transparent !border border-zinc-700 dark:!border-zinc-200 !shadow-none",
          // 取消 HeroUI 預設 hover-unselected 變透明，只讓字變亮（不加背景）
          tab: "data-[hover-unselected=true]:opacity-100",
          tabContent:
            "group-data-[hover-unselected=true]:text-zinc-600 dark:group-data-[hover-unselected=true]:text-zinc-300",
        }}
        selectedKey={String(value)}
        onSelectionChange={(key) => onChange(Number(key))}
      >
        {options.map((d) => (
          <Tab key={String(d.direction)} title={labelFor(d)} />
        ))}
      </Tabs>
    </div>
  );
};

export default TrStationDirectionFilter;
