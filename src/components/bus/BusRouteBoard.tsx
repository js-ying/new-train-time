import AdBanner from "@/components/common/AdBanner";
import CommonDialog from "@/components/common/CommonDialog";
import { useAuth } from "@/contexts/AuthContext";
import { GaEnum } from "@/enums/GaEnum";
import useIsStuck from "@/hooks/useIsStuck";
import useSetting from "@/hooks/useSetting";
import useStationFavorites from "@/hooks/useStationFavorites";
import { JsyBusRouteBoard, JsyBusStopArrival } from "@/models/jsy-bus-info";
import AdUtils from "@/utils/AdUtils";
import {
  encodeBusStopFavoriteId,
  encodeBusStopFavoriteName,
} from "@/utils/BusStopFavoriteUtils";
import { gaClickEvent } from "@/utils/GaUtils";
import { Tab, Tabs } from "@heroui/react";
import { useTranslation } from "next-i18next";
import { FC, ReactNode, useState } from "react";
import BusStopRow from "./BusStopRow";

interface BusRouteBoardProps {
  /** 後端回傳的雙向看板（通常 2 筆：去程 0 / 返程 1，部分路線僅 1 向） */
  boards: JsyBusRouteBoard[];
  /** 目前選擇的方向 direction */
  direction: number;
  onDirectionChange: (direction: number) => void;
  /** 路線名（顯示於 sticky 頂部、方向切換上一排，下滑時仍知道看的是哪條路線） */
  routeName?: string;
  /** 子線名（子線看板才有）；站列收藏三元組帶上，與看板同粒度 */
  subRouteName?: string;
  /** 掛在方向切換同列最左的元件（如路線詳細資訊 icon）；absolute 不影響 tab 置中 */
  leadingSlot?: ReactNode;
  /** 掛在方向切換同列最右的元件（登入：倒數環；未登入：刷新+登入引導）；absolute 不影響 tab 置中 */
  cornerSlot?: ReactNode;
  /** 收藏愛心：吸頂時掛在路線名同列最右（未吸頂時由頁面在搜尋列顯示） */
  favoriteSlot?: ReactNode;
  /** 資料時效警示條：放 sticky 容器內（路線名下、方向 tab 上），吸頂時仍可見 */
  warningSlot?: ReactNode;
  /** 點站序某站 → 跳該站牌看板（市區公車站才可點，由 BusStopRow 依 city 自判） */
  onSelectStop?: (stop: JsyBusStopArrival) => void;
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
  subRouteName,
  leadingSlot,
  cornerSlot,
  favoriteSlot,
  warningSlot,
  onSelectStop,
}) => {
  const { t } = useTranslation();
  const current = boards.find((b) => b.direction === direction) ?? boards[0];
  // sticky 吸頂時才顯示路線名（未吸頂時搜尋框已有路線資訊，不重複）
  const { sentinelRef, isStuck } = useIsStuck<HTMLDivElement>();

  // tab 標籤直接顯示該方向目的地（「往 X」）；公車方向對使用者的意義是去哪，而非北上/南下
  const labelFor = (board: JsyBusRouteBoard) =>
    t("busTowards", { destination: board.destinationStop });

  // 站列愛心＝收藏該（站牌×本路線×當前方向）到站（BUS_STOP 分組），與站牌看板列愛心同語意
  const { user, loginWithGoogle } = useAuth();
  const { addFavorite, removeFavorite, isFavorite } =
    useStationFavorites("BUS_STOP");
  const [showFavoriteRoutes] = useSetting("showFavoriteRoutes");
  const [loginOpen, setLoginOpen] = useState(false);
  const [limitOpen, setLimitOpen] = useState(false);

  // 未登入跳登入引導；已收藏→移除；未收藏→加入（已滿跳上限提示）
  const handleToggleStopFavorite = (
    stop: JsyBusStopArrival,
    targetId: string,
  ) => {
    if (!user) {
      setLoginOpen(true);
      return;
    }
    const fav = isFavorite(targetId);
    gaClickEvent(fav ? GaEnum.UNFAVORITE_ROUTE : GaEnum.FAVORITE_ROUTE);
    if (fav) {
      removeFavorite(targetId);
    } else if (
      addFavorite({
        targetId,
        targetName: encodeBusStopFavoriteName(
          routeName || current?.routeName || "",
          current?.destinationStop ?? "",
          stop.stopName,
        ),
      }) === "limit"
    ) {
      setLimitOpen(true);
    }
  };

  // 不可收藏（設定關閉 / 市區公車站不在 bus_stop）回 undefined → 該列不掛愛心；
  // 可收藏條件與可點跳站牌頁一致（batch 反查 bus_stop，同一前提）
  const favoriteFor = (stop: JsyBusStopArrival) => {
    if (!showFavoriteRoutes || !current) return undefined;
    if (current.source === "city" && !stop.city) return undefined;
    const targetId = encodeBusStopFavoriteId({
      stopUid: stop.stopUid,
      routeUid: current.routeUid,
      direction: current.direction,
      subRouteName,
    });
    return {
      isFavorited: isFavorite(targetId),
      onToggle: () => handleToggleStopFavorite(stop, targetId),
    };
  };

  return (
    <div className="flex flex-col">
      {/* sentinel：偵測 sticky 是否吸頂（離開視窗頂端 → isStuck），決定是否顯示路線名 */}
      <div ref={sentinelRef} className="h-px" aria-hidden="true" />
      {/* sticky 頂部：方向切換，下滑看站序時固定可見。
          z-[5]：高於站序卡片(z-auto)以遮住捲動內容，但低於 sidebar drawer(z-10)避免蓋到側欄 */}
      <div className="sticky top-0 z-[5] -mx-4 flex flex-col gap-2 bg-background/20 py-2 backdrop-blur-md">
        {/* 路線名：方向切換上一排，僅吸頂時顯示（未吸頂時搜尋框已標示路線）；
            收藏愛心 absolute 掛同列最右（未吸頂時改由搜尋列的愛心顯示） */}
        {routeName && isStuck && (
          <div className="relative">
            <div className="text-center text-base font-bold">{routeName}</div>
            {favoriteSlot && (
              <div className="absolute inset-y-0 right-4 flex items-center">
                {favoriteSlot}
              </div>
            )}
          </div>
        )}
        {warningSlot && (
          <div className={isStuck ? undefined : "mb-3"}>{warningSlot}</div>
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
          <div className="mt-2 flex flex-col gap-3">
            {/* key 含 index：折返/繞駛路線官方站序同站可重複行經（同 stopUid 兩列） */}
            {current.stops.map((stop, index) => (
              <div key={`${stop.stopUid}-${index}`}>
                <BusStopRow
                  stop={stop}
                  source={current.source}
                  onSelectStop={onSelectStop}
                  favorite={favoriteFor(stop)}
                />
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
          <div className="text-center text-sm text-muted-foreground">
            {t("busBoardEmpty")}
          </div>
        ))}

      {/* 未登入點愛心：引導登入 */}
      <CommonDialog
        open={loginOpen}
        setOpen={setLoginOpen}
        title="favoriteRequiresLoginTitle"
        confirmText="login"
        cancelText="cancel"
        onConfirm={() => {
          gaClickEvent(GaEnum.LOGIN_WITH_GOOGLE);
          void loginWithGoogle();
        }}
      >
        {t("favoriteStopRequiresLogin")}
      </CommonDialog>

      {/* 收藏已滿：提示先移除 */}
      <CommonDialog
        open={limitOpen}
        setOpen={setLimitOpen}
        title="favoriteLimitTitle"
        confirmText="gotItLabel"
      >
        {t("favoriteStopLimitReached")}
      </CommonDialog>
    </div>
  );
};

export default BusRouteBoard;
