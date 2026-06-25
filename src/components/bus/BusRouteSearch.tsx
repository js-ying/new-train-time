import useBusRouteSearch from "@/hooks/search/useBusRouteSearch";
import { JsyBusRoute } from "@/models/jsy-bus-info";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { useTranslation } from "next-i18next";
import { FC, Key } from "react";

interface BusRouteSearchProps {
  /** 已選路線（顯示在輸入框）；null 表未選 */
  selectedRoute: JsyBusRoute | null;
  onSelect: (route: JsyBusRoute) => void;
}

/** 路線來源 → i18n key（市區公車另以縣市名取代）。 */
const SOURCE_LABEL_KEY: Record<JsyBusRoute["source"], string> = {
  city: "busSourceCity",
  intercity: "busSourceIntercity",
  taiwantrip: "busSourceTaiwanTrip",
};

/**
 * [公車] 路線號模糊搜（HeroUI Autocomplete，遠端防抖搜尋）。
 * 候選顯示「路線名 / 起 - 訖 · 來源或縣市」；選定後回呼上層導航至看板。
 */
const BusRouteSearch: FC<BusRouteSearchProps> = ({
  selectedRoute,
  onSelect,
}) => {
  const { t } = useTranslation();
  const { suggestions, isLoading, setQuery } = useBusRouteSearch();

  // 候選描述：「起 - 訖 · 來源/縣市」。台灣好行優先顯示好行分類（城市籍好行 source 仍為 city）。
  const describe = (r: JsyBusRoute): string => {
    let sourceLabel: string;
    if (r.isTaiwanTrip) {
      sourceLabel = t(SOURCE_LABEL_KEY.taiwantrip);
    } else if (r.source === "city" && r.city) {
      sourceLabel = t(`busCity.${r.city}`, { defaultValue: r.city });
    } else {
      sourceLabel = t(SOURCE_LABEL_KEY[r.source]);
    }
    return `${r.departureStop} - ${r.destinationStop} · ${sourceLabel}`;
  };

  const handleSelectionChange = (key: Key | null) => {
    if (key == null) return;
    const route = suggestions.find((r) => r.routeUid === key);
    if (route) onSelect(route);
  };

  return (
    <Autocomplete
      // selectedRoute 變更（分享連結/重新整理/上一頁/清空）時 remount，讓 defaultInputValue 重新生效
      key={selectedRoute?.routeUid ?? "empty"}
      label={t("busRouteSearchLabel")}
      placeholder={t("busRouteSearchPlaceholder")}
      aria-label={t("busRouteSearchLabel")}
      items={suggestions}
      isLoading={isLoading}
      defaultInputValue={selectedRoute?.routeName ?? ""}
      onInputChange={setQuery}
      onSelectionChange={handleSelectionChange}
      menuTrigger="input"
      allowsCustomValue
      listboxProps={{ emptyContent: t("busRouteSearchEmpty") }}
      variant="bordered"
      size="lg"
    >
      {(route: JsyBusRoute) => (
        <AutocompleteItem key={route.routeUid} textValue={route.routeName}>
          <div className="flex flex-col">
            <span className="font-bold">{route.routeName}</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {describe(route)}
            </span>
          </div>
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
};

export default BusRouteSearch;
