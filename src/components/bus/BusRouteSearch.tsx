import BusRouteSearchDialog from "@/components/bus/BusRouteSearchDialog";
import Area from "@/components/search-area/Area";
import useBusRouteSearch from "@/hooks/search/useBusRouteSearch";
import useBusName from "@/hooks/useBusName";
import useCoarsePointer from "@/hooks/useCoarsePointer";
import { JsyBusRoute } from "@/models/jsy-bus-info";
import { useTranslation } from "next-i18next";
import { FC, useEffect, useState } from "react";

interface BusRouteSearchProps {
  /** 已選路線（顯示在按鈕內）；null 表未選 */
  selectedRoute: JsyBusRoute | null;
  onSelect: (route: JsyBusRoute) => void;
}

/**
 * [公車] 路線號模糊搜：沿用單站「出發車站」按鈕樣式（Area），點開搜尋面板（專用鍵盤 + 遠端候選）。
 */
const BusRouteSearch: FC<BusRouteSearchProps> = ({
  selectedRoute,
  onSelect,
}) => {
  const { t } = useTranslation();
  const busName = useBusName();
  const isCoarsePointer = useCoarsePointer();
  const { suggestions, resultQuery, isLoading, setQuery } =
    useBusRouteSearch();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // 換已選路線（選定 / 分享連結 / 上一頁）→ 清空搜尋字串與候選
  useEffect(() => {
    setInputValue("");
    setQuery("");
  }, [selectedRoute?.routeUid, setQuery]);

  const handleSelect = (route: JsyBusRoute) => {
    onSelect(route);
    setIsOpen(false);
    setInputValue("");
    setQuery("");
  };

  const handleInput = (v: string) => {
    setInputValue(v);
    setQuery(v);
  };

  // 子線候選的 routeNameEn 為該子線英文
  const selectedName = selectedRoute
    ? busName(selectedRoute.routeName, selectedRoute.routeNameEn)
    : "";

  return (
    <div className="flex flex-col gap-3">
      {/* 出發車站樣式按鈕：上排標籤、下排已選路線（置中）。
          寬度比照 TR 單站「出發車站」：手機滿版、電腦收成 342px 置中 */}
      <Area
        className="mx-auto w-full md:max-w-[342px]"
        isActive={isOpen}
        onClick={() => setIsOpen(true)}
      >
        {t("busRouteSearchLabel")}
        <div className="whitespace-normal">{selectedName}</div>
      </Area>

      <BusRouteSearchDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        inputValue={inputValue}
        onInputChange={handleInput}
        suggestions={suggestions}
        resultQuery={resultQuery}
        isLoading={isLoading}
        onSelect={handleSelect}
        isCoarsePointer={isCoarsePointer}
      />
    </div>
  );
};

export default BusRouteSearch;
