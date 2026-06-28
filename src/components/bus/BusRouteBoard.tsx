import AdBanner from "@/components/common/AdBanner";
import useIsStuck from "@/hooks/useIsStuck";
import { JsyBusRouteBoard } from "@/models/jsy-bus-info";
import AdUtils from "@/utils/AdUtils";
import { Tab, Tabs } from "@heroui/react";
import { useTranslation } from "next-i18next";
import { FC, ReactNode } from "react";
import BusStopRow from "./BusStopRow";

interface BusRouteBoardProps {
  /** 後端回傳的雙向看板（通常 2 筆：去程 0 / 返程 1，部分路線僅 1 向） */
  boards: JsyBusRouteBoard[];
  /** 目前選擇的方向 direction */
  direction: number;
  onDirectionChange: (direction: number) => void;
  /** 路線名（顯示於 sticky 頂部、方向切換上一排，下滑時仍知道看的是哪條路線） */
  routeName?: string;
  /** 掛在方向切換同列最左的元件（如路線詳細資訊 icon）；absolute 不影響 tab 置中 */
  leadingSlot?: ReactNode;
  /** 掛在方向切換同列最右的元件（登入：倒數環；未登入：刷新+登入引導）；absolute 不影響 tab 置中 */
  cornerSlot?: ReactNode;
}

/**
 * [公車] 雙向即時看板：去程/返程 pill Tabs 切換（沿用單站方向篩選樣式）+ 站序列表。
 * arrivals 一次回兩向，方向切換為純前端、不重抓。
 */
const BusRouteBoard: FC<BusRouteBoardProps> = ({
  boards,
  direction,
  onDirectionChange,
  routeName,
  leadingSlot,
  cornerSlot,
}) => {
  const { t } = useTranslation();
  const current = boards.find((b) => b.direction === direction) ?? boards[0];
  // sticky 吸頂時才顯示路線名（未吸頂時搜尋框已有路線資訊，不重複）
  const { sentinelRef, isStuck } = useIsStuck<HTMLDivElement>();

  // tab 標籤直接顯示該方向目的地（「往 X」）；公車方向對使用者的意義是去哪，而非北上/南下
  const labelFor = (board: JsyBusRouteBoard) =>
    t("busTowards", { destination: board.destinationStop });

  return (
    <div className="flex flex-col">
      {/* sentinel：偵測 sticky 是否吸頂（離開視窗頂端 → isStuck），決定是否顯示路線名 */}
      <div ref={sentinelRef} className="h-px" aria-hidden="true" />
      {/* sticky 頂部：方向切換，下滑看站序時固定可見。
          z-[5]：高於站序卡片(z-auto)以遮住捲動內容，但低於 sidebar drawer(z-10)避免蓋到側欄 */}
      <div className="sticky top-0 z-[5] -mx-4 flex flex-col gap-2 bg-background/20 py-2 backdrop-blur-md">
        {/* 路線名：方向切換上一排，僅吸頂時顯示（未吸頂時搜尋框已標示路線） */}
        {routeName && isStuck && (
          <div className="text-center text-base font-bold">{routeName}</div>
        )}
        {/* 方向切換列：tab/目的地置中，leadingSlot（詳細資訊）掛最左、cornerSlot（刷新/倒數環）掛最右 */}
        <div className="relative">
          {leadingSlot && (
            <div className="absolute left-4 top-6 -translate-y-1/2">
              {leadingSlot}
            </div>
          )}
          {/* 單向也渲染 tab（單一 active pill）：列高與多向一致，leadingSlot/cornerSlot 才不會歪 */}
          <div className="flex justify-center">
            <Tabs
              variant="solid"
              radius="full"
              size="md"
              classNames={{
                tabList: "!bg-transparent",
                cursor:
                  "!bg-transparent !border border-zinc-700 dark:!border-zinc-200 !shadow-none",
                tab: "data-[hover-unselected=true]:opacity-100",
                tabContent:
                  "group-data-[hover-unselected=true]:text-zinc-600 dark:group-data-[hover-unselected=true]:text-zinc-300",
              }}
              selectedKey={String(current?.direction ?? 0)}
              onSelectionChange={(key) => onDirectionChange(Number(key))}
            >
              {boards.map((b) => (
                <Tab key={String(b.direction)} title={labelFor(b)} />
              ))}
            </Tabs>
          </div>

          {cornerSlot && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {cornerSlot}
            </div>
          )}
        </div>
      </div>

      {current &&
        (current.stops.length > 0 ? (
          <div className="mt-2 flex flex-col gap-2">
            {current.stops.map((stop, index) => (
              <div key={stop.stopUid}>
                <BusStopRow stop={stop} />
                {/* 站序內插廣告：最多第三筆後，不足三筆遞減（同 OD） */}
                {AdUtils.showAd(current.stops.length, index) && (
                  <div className="mt-2 empty:hidden">
                    <AdBanner mode="trainInfo" />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            {t("busBoardEmpty")}
          </div>
        ))}
    </div>
  );
};

export default BusRouteBoard;
