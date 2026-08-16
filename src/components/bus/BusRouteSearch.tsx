import Area from "@/components/search-area/Area";
import useBusRouteSearch, {
  BUS_ROUTE_QUERY_MAX_LEN,
} from "@/hooks/search/useBusRouteSearch";
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
  const { suggestions, isLoading, setQuery } = useBusRouteSearch();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  // 鍵盤高亮的候選 index（-1 = 焦點在輸入框、無高亮）
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // 展開時自動 focus 搜尋框（PC / 手機皆同）
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  // 換已選路線（選定 / 分享連結 / 上一頁）→ 清空搜尋字串與候選
  useEffect(() => {
    setInputValue("");
    setQuery("");
  }, [selectedRoute?.routeUid, setQuery]);

  // 候選變動 → 若有與輸入完全相符的路線號（如打「1824」對到「1824」）則自動高亮，方便直接 Enter；否則重置
  useEffect(() => {
    const q = inputValue.trim().toUpperCase();
    const exactIdx = q
      ? suggestions.findIndex((r) => r.routeName.toUpperCase() === q)
      : -1;
    setActiveIndex(exactIdx);
  }, [suggestions, inputValue]);

  // 高亮移動 → 把該項捲進可視範圍
  useEffect(() => {
    if (activeIndex >= 0) {
      itemRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  // 候選描述：「起 - 訖（經停標註）· 來源/縣市」。起訖維持原格式；子線方向牌（headsign）
  // 只抽「[經X]」經停標註附加，用來區分起訖相同的子線（如 1824/1824A 終點同為苗栗）。台灣好行優先顯示好行分類。
  const describe = (r: JsyBusRoute): string => {
    let sourceLabel: string;
    if (r.isTaiwanTrip) {
      sourceLabel = t(SOURCE_LABEL_KEY.taiwantrip);
    } else if (r.source === "city" && r.city) {
      sourceLabel = t(`busCity.${r.city}`, { defaultValue: r.city });
    } else {
      sourceLabel = t(SOURCE_LABEL_KEY[r.source]);
    }
    const via = r.headsign?.match(/\[[^\]]*\]/)?.[0] ?? "";
    const route = `${r.departureStop} - ${r.destinationStop}${via ? ` ${via}` : ""}`;
    return `${route} · ${sourceLabel}`;
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
        // input + 候選浮層寬度對齊上方「公車路線」Area（桌機 342px 置中）
        <div className="mx-auto w-full md:max-w-[342px]">
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={showPanel}
            aria-controls="bus-route-listbox"
            aria-activedescendant={
              activeIndex >= 0 ? `bus-route-opt-${activeIndex}` : undefined
            }
            value={inputValue}
            maxLength={BUS_ROUTE_QUERY_MAX_LEN}
            onChange={(e) => handleInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="common-input mt-2"
            placeholder={t("busRouteSearchPlaceholder")}
          />

          {/* 候選浮層：background 底 + border + shadow-medium + rounded-large，
              底色與邊框配色對齊轉乘頁下拉、避免深色下貼背景；空字串不顯示 */}
          {showPanel && (
            // 外層負責邊框/圓角/陰影並 overflow-hidden，使捲動時內層 scrollbar 被裁進圓角內，右上/右下圓角才不消失
            <div className="mt-2 overflow-hidden rounded-large border border-input bg-background shadow-medium">
              <div
                id="bus-route-listbox"
                role="listbox"
                // p-2 讓高亮四周留白更寬，浮卡感貼近 HeroUI 下拉（避免高亮貼著外框邊）
                className="flex max-h-80 flex-col gap-0.5 overflow-y-auto p-2"
              >
                {suggestions.length > 0 ? (
                  suggestions.map((route, i) => (
                    <button
                      key={`${route.routeUid}|${route.subRouteName ?? ""}`}
                      id={`bus-route-opt-${i}`}
                      role="option"
                      aria-selected={i === activeIndex}
                      ref={(el) => {
                        itemRefs.current[i] = el;
                      }}
                      type="button"
                      onClick={() => handleSelect(route)}
                      onMouseEnter={() => setActiveIndex(i)}
                      // 高亮配色對齊轉乘頁下拉（zinc-200 / dark zinc-700）；rounded-medium 圓角貼近外框 rounded-large
                      className={`custom-cursor-pointer flex w-full flex-col rounded-medium px-3 py-2 text-left transition-colors ${
                        i === activeIndex ? "bg-muted" : ""
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
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BusRouteSearch;
