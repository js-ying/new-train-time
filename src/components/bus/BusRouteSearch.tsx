import Area from "@/components/search-area/Area";
import useBusRouteSearch from "@/hooks/search/useBusRouteSearch";
import useRwd from "@/hooks/useRwd";
import { JsyBusRoute } from "@/models/jsy-bus-info";
import { useTranslation } from "next-i18next";
import { FC, KeyboardEvent, useEffect, useRef, useState } from "react";

interface BusRouteSearchProps {
  /** 已選路線（顯示在按鈕內）；null 表未選 */
  selectedRoute: JsyBusRoute | null;
  onSelect: (route: JsyBusRoute) => void;
}

/** 路線來源 → i18n key（市區公車另以縣市名取代）。 */
export const SOURCE_LABEL_KEY: Record<JsyBusRoute["source"], string> = {
  city: "busSourceCity",
  intercity: "busSourceIntercity",
  taiwantrip: "busSourceTaiwanTrip",
};

/**
 * [公車] 路線號模糊搜：沿用單站「出發車站」按鈕樣式（Area），點開展下拉，
 * 內含搜尋框（遠端防抖）+ 候選浮層清單；輸入框可用上下鍵在候選間移動、Enter 選定。
 */
const BusRouteSearch: FC<BusRouteSearchProps> = ({
  selectedRoute,
  onSelect,
}) => {
  const { t } = useTranslation();
  const { isMobile } = useRwd();
  const { suggestions, isLoading, setQuery } = useBusRouteSearch();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  // 鍵盤高亮的候選 index（-1 = 焦點在輸入框、無高亮）
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // 展開時電腦版自動 focus 搜尋框（比照 TR 單站 picker）
  useEffect(() => {
    if (isOpen && !isMobile) inputRef.current?.focus();
  }, [isOpen, isMobile]);

  // 換已選路線（選定 / 分享連結 / 上一頁）→ 清空搜尋字串與候選
  useEffect(() => {
    setInputValue("");
    setQuery("");
  }, [selectedRoute?.routeUid, setQuery]);

  // 候選變動 → 重置高亮（避免 index 指到舊清單）
  useEffect(() => {
    setActiveIndex(-1);
  }, [suggestions]);

  // 高亮移動 → 把該項捲進可視範圍
  useEffect(() => {
    if (activeIndex >= 0) {
      itemRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

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

  const handleSelect = (route: JsyBusRoute) => {
    onSelect(route);
    setIsOpen(false);
    setInputValue("");
    setQuery("");
    setActiveIndex(-1);
  };

  const handleInput = (v: string) => {
    setInputValue(v);
    setQuery(v);
    setActiveIndex(-1);
  };

  // 上下鍵移動高亮、Enter 選定（無高亮則選排序最前者）、Esc 收合
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      const pick = activeIndex >= 0 ? suggestions[activeIndex] : suggestions[0];
      if (pick) handleSelect(pick);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const selectedName = selectedRoute?.routeName ?? "";
  const hasQuery = inputValue.trim() !== "";
  const showPanel = suggestions.length > 0 || isLoading || hasQuery;

  return (
    <div className="flex flex-col gap-3">
      {/* 出發車站樣式按鈕：上排標籤、下排已選路線（置中）；點擊展開下拉。
          寬度比照 TR 單站「出發車站」：手機滿版、電腦收成 342px 置中 */}
      <Area
        className="mx-auto w-full md:max-w-[342px]"
        isActive={isOpen}
        onClick={() => setIsOpen((v) => !v)}
      >
        {t("busRouteSearchLabel")}
        <div>{selectedName}</div>
      </Area>

      {isOpen && (
        <div>
          <input
            ref={inputRef}
            type="input"
            role="combobox"
            aria-expanded={showPanel}
            aria-controls="bus-route-listbox"
            aria-activedescendant={
              activeIndex >= 0 ? `bus-route-opt-${activeIndex}` : undefined
            }
            value={inputValue}
            onChange={(e) => handleInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="common-input mt-2"
            placeholder={t("busRouteSearchPlaceholder")}
          />

          {/* 候選浮層：用 HeroUI 語意 token（content1 底 + shadow-medium + rounded-large），
              與專案其他 HeroUI dropdown 一致；空字串不顯示 */}
          {showPanel && (
            <div
              id="bus-route-listbox"
              role="listbox"
              className="mt-2 flex max-h-80 flex-col gap-0.5 overflow-y-auto rounded-large bg-content1 p-1 shadow-medium"
            >
              {suggestions.length > 0 ? (
                suggestions.map((route, i) => (
                  <button
                    key={route.routeUid}
                    id={`bus-route-opt-${i}`}
                    role="option"
                    aria-selected={i === activeIndex}
                    ref={(el) => {
                      itemRefs.current[i] = el;
                    }}
                    type="button"
                    onClick={() => handleSelect(route)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`custom-cursor-pointer flex w-full flex-col rounded-small px-3 py-2 text-left transition-colors ${
                      i === activeIndex ? "bg-default-100" : ""
                    }`}
                  >
                    <span className="font-bold">{route.routeName}</span>
                    <span className="text-xs text-default-500">
                      {describe(route)}
                    </span>
                  </button>
                ))
              ) : isLoading ? (
                <div className="px-3 py-2 text-sm text-default-500">
                  {t("busRouteSearchLoading")}
                </div>
              ) : (
                <div className="px-3 py-2 text-sm text-default-500">
                  {t("busRouteSearchEmpty")}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BusRouteSearch;
