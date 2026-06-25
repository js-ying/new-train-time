import { JsyBusRouteBoard } from "@/models/jsy-bus-info";
import { Tab, Tabs } from "@heroui/react";
import { useTranslation } from "next-i18next";
import { FC } from "react";
import BusStopRow from "./BusStopRow";

interface BusRouteBoardProps {
  /** 後端回傳的雙向看板（通常 2 筆：去程 0 / 返程 1，部分路線僅 1 向） */
  boards: JsyBusRouteBoard[];
  /** 目前選擇的方向 direction */
  direction: number;
  onDirectionChange: (direction: number) => void;
}

/**
 * [公車] 雙向即時看板：去程/返程 pill Tabs 切換（沿用單站方向篩選樣式）+ 站序列表。
 * arrivals 一次回兩向，方向切換為純前端、不重抓。
 */
const BusRouteBoard: FC<BusRouteBoardProps> = ({
  boards,
  direction,
  onDirectionChange,
}) => {
  const { t } = useTranslation();
  const current = boards.find((b) => b.direction === direction) ?? boards[0];

  const labelFor = (d: number) =>
    d === 0 ? t("busDirectionOutbound") : t("busDirectionInbound");

  return (
    <div className="flex flex-col gap-4">
      {boards.length > 1 && (
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
              <Tab key={String(b.direction)} title={labelFor(b.direction)} />
            ))}
          </Tabs>
        </div>
      )}

      {current && (
        <>
          <div className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            {t("busTowards", { destination: current.destinationStop })}
          </div>

          {current.stops.length > 0 ? (
            <div className="flex flex-col gap-2">
              {current.stops.map((stop) => (
                <BusStopRow key={stop.stopUid} stop={stop} />
              ))}
            </div>
          ) : (
            <div className="text-center text-sm text-zinc-500 dark:text-zinc-400">
              {t("busBoardEmpty")}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BusRouteBoard;
