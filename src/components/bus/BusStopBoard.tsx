import { JsyBusStopBoard, JsyBusStopBoardRoute } from "@/models/jsy-bus-info";
import { useTranslation } from "next-i18next";
import { FC } from "react";
import BusArrivalBadge from "./BusArrivalBadge";

interface BusStopBoardProps {
  board: JsyBusStopBoard;
  /** 點某路線 → 跳該路線看板（帶 routeUid + board 所在縣市）。 */
  onSelectRoute: (route: JsyBusStopBoardRoute) => void;
}

/** [公車] 站牌即時看板：列出該站牌所有路線的到站（可點進路線看板），依到站排序。 */
const BusStopBoard: FC<BusStopBoardProps> = ({ board, onSelectRoute }) => {
  const { t } = useTranslation();

  if (board.routes.length === 0) {
    return (
      <div className="rounded-xl border border-solid border-foreground p-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
        {t("busStopBoardEmpty")}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {board.routes.map((r) => (
        <button
          key={`${r.routeUid}-${r.subRouteName ?? ""}-${r.direction}`}
          type="button"
          onClick={() => onSelectRoute(r)}
          className="custom-cursor-pointer grid w-full grid-cols-[1fr_auto] items-center gap-2 rounded-md border border-solid border-foreground p-3 text-left"
        >
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-bold">{r.subRouteName || r.routeName}</span>
            {r.destination && (
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {t("busTowards", { destination: r.destination })}
              </span>
            )}
          </div>
          <BusArrivalBadge state={r.state} estimateMinutes={r.estimateMinutes} />
        </button>
      ))}
    </div>
  );
};

export default BusStopBoard;
