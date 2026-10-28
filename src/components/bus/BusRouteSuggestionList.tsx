import useBusName from "@/hooks/useBusName";
import { JsyBusRoute } from "@/models/jsy-bus-info";
import { SOURCE_LABEL_KEY } from "@/utils/BusUtils";
import { useTranslation } from "next-i18next";
import { FC, ReactNode, useEffect, useRef } from "react";

export const BUS_ROUTE_LISTBOX_ID = "bus-route-listbox";

/** 候選 option 的 DOM id（供 combobox 的 aria-activedescendant） */
export const busRouteOptionId = (i: number): string => `bus-route-opt-${i}`;

interface BusRouteSuggestionListProps {
  suggestions: JsyBusRoute[];
  isLoading: boolean;
  hasQuery: boolean;
  /** 高亮的候選 index（-1 = 無高亮） */
  activeIndex: number;
  onActiveIndexChange: (i: number) => void;
  onSelect: (route: JsyBusRoute) => void;
  /** 空輸入時顯示的內容 */
  emptyContent: ReactNode;
}

/**
 * [公車] 路線候選清單：路線名 + 「起 - 訖（經停）· 來源/縣市」；空輸入渲染 emptyContent。
 */
const BusRouteSuggestionList: FC<BusRouteSuggestionListProps> = ({
  suggestions,
  isLoading,
  hasQuery,
  activeIndex,
  onActiveIndexChange,
  onSelect,
  emptyContent,
}) => {
  const { t } = useTranslation();
  const busName = useBusName();
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

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
    // 經停標註：中文方向牌為「[經X]」，英文為 (Via X) 或 [Via X]，
    // 限定 Via 開頭才取，避免誤抓站名自帶的括號
    const via = busName(
      r.headsign?.match(/\[[^\]]*\]/)?.[0] ?? "",
      r.headsignEn?.match(/[[(]\s*via[^\])]*[\])]/i)?.[0],
    );
    const dep = busName(r.departureStop, r.departureStopEn);
    const dest = busName(r.destinationStop, r.destinationStopEn);
    const route = `${dep} - ${dest}${via ? ` ${via}` : ""}`;
    return `${route} · ${sourceLabel}`;
  };

  const hint = (text: ReactNode) => (
    <div className="px-3 py-2 text-sm text-default-500">{text}</div>
  );

  return (
    <div
      id={BUS_ROUTE_LISTBOX_ID}
      role="listbox"
      className="flex flex-col gap-0.5"
    >
      {suggestions.length > 0
        ? suggestions.map((route, i) => (
            <button
              key={`${route.routeUid}|${route.subRouteName ?? ""}`}
              id={busRouteOptionId(i)}
              role="option"
              aria-selected={i === activeIndex}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              type="button"
              onClick={() => onSelect(route)}
              // 只在滑鼠實際移動時跟隨；版面重排造成的 mouseover 不搶走完全相符的高亮
              onPointerMove={(e) => {
                if (e.pointerType === "mouse" && i !== activeIndex) {
                  onActiveIndexChange(i);
                }
              }}
              // 高亮配色對齊轉乘頁下拉（zinc-200 / dark zinc-700）
              className={`custom-cursor-pointer flex w-full flex-col rounded-medium px-3 py-1.5 text-left transition-colors ${
                i === activeIndex ? "bg-muted" : ""
              }`}
            >
              <span className="font-bold leading-5">
                {busName(route.routeName, route.routeNameEn)}
              </span>
              <span className="text-xs text-default-500">
                {describe(route)}
              </span>
            </button>
          ))
        : isLoading
          ? hint(t("busRouteSearchLoading"))
          : hasQuery
            ? hint(t("busRouteSearchEmpty"))
            : hint(emptyContent)}
    </div>
  );
};

export default BusRouteSuggestionList;
