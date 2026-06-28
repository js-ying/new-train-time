import BusAutoRefreshRing from "@/components/bus/BusAutoRefreshRing";
import BusRouteBoard from "@/components/bus/BusRouteBoard";
import BusRouteInfoModal from "@/components/bus/BusRouteInfoModal";
import BusRouteSearch, { SOURCE_LABEL_KEY } from "@/components/bus/BusRouteSearch";
import BusStopBoard from "@/components/bus/BusStopBoard";
import AdBanner from "@/components/common/AdBanner";
import CommonDialog from "@/components/common/CommonDialog";
import Loading from "@/components/common/Loading";
import RefreshButton from "@/components/common/RefreshButton";
import LocateIcon from "@/components/icons/LocateIcon";
import Layout from "@/components/layout/Layout";
import PageSeo from "@/components/seo/PageSeo";
import StationFavoriteButton from "@/components/station-history/StationFavoriteButton";
import StationHistoryPanel from "@/components/station-history/StationHistoryPanel";
import NoTrainData from "@/components/train-time-table/NoTrainData";
import { useAuth } from "@/contexts/AuthContext";
import { GaEnum } from "@/enums/GaEnum";
import useBusRouteArrivals, {
  BusRouteSelection,
  POLL_INTERVAL_MS,
} from "@/hooks/search/useBusRouteArrivals";
import useBusRouteInfo from "@/hooks/search/useBusRouteInfo";
import useBusStopBoard, {
  BusStopSelection,
} from "@/hooks/search/useBusStopBoard";
import useNearestBusStop from "@/hooks/search/useNearestBusStop";
import useMuiTheme from "@/hooks/useMuiTheme";
import useRefreshCooldown from "@/hooks/useRefreshCooldown";
import useStationHistory from "@/hooks/useStationHistory";
import {
  BusSource,
  JsyBusNearestStop,
  JsyBusRoute,
  JsyBusStopBoardRoute,
} from "@/models/jsy-bus-info";
import { StationTarget } from "@/models/station-history";
import AdUtils from "@/utils/AdUtils";
import { gaClickEvent } from "@/utils/GaUtils";
import { Button } from "@heroui/react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { FC, useEffect, useRef, useState } from "react";

// i18n（公車頁為即時看板，不做 SSR 取數；資料於 client 抓 + 輪詢）
export async function getServerSideProps({ locale }: { locale: string }) {
  return { props: { ...(await serverSideTranslations(locale)) } };
}

const VALID_SOURCES: BusSource[] = ["city", "intercity", "taiwantrip"];

// 同查詢冷卻：5 秒內重查同路線 / 定位到同站牌 → 擋下並提示，比照 TR 單站 picker
const SAME_QUERY_COOLDOWN_MS = 5000;

/** 從 URL query 還原已選路線（重新整理 / 分享連結可直接看板；route 為顯示用最小資訊）。 */
const parseRouteFromQuery = (query: ParsedUrlQuery): JsyBusRoute | null => {
  const routeUid = typeof query.routeUid === "string" ? query.routeUid : null;
  const source =
    typeof query.source === "string" &&
    VALID_SOURCES.includes(query.source as BusSource)
      ? (query.source as BusSource)
      : null;
  if (!routeUid || !source) return null;

  const city = typeof query.city === "string" ? query.city : undefined;
  const name = typeof query.name === "string" ? query.name : routeUid;
  return {
    routeUid,
    routeName: name,
    source,
    city,
    departureStop: "",
    destinationStop: "",
    routeType: 0,
  };
};

/**
 * 公車歷史 / 收藏的 meta 編解碼：route_uid 不足以重查看板（arrivals 需 source，source=city 需 city），
 * 故把路由資訊存進通用單點表的 meta 欄（"source|city"）。
 */
const encodeBusMeta = (source: BusSource, city?: string): string =>
  `${source}|${city ?? ""}`;

const decodeBusMeta = (meta?: string): { source: BusSource; city?: string } => {
  const [rawSource, rawCity] = (meta ?? "").split("|");
  const source = VALID_SOURCES.includes(rawSource as BusSource)
    ? (rawSource as BusSource)
    : "city";
  return { source, city: rawCity || undefined };
};

/** 詳細資訊（i）icon。 */
const InfoIcon: FC = () => (
  <svg
    viewBox="0 0 24 24"
    className="size-5"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 11v5M12 8h.01" />
  </svg>
);

/** [頁面] 公車路線即時到站查詢（模糊搜 → 選路線 → 去/返程即時看板，輪詢刷新）。 */
const BusPage: FC = () => {
  const muiTheme = useMuiTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const { loginWithGoogle } = useAuth();

  const [selectedRoute, setSelectedRoute] = useState<JsyBusRoute | null>(null);
  const [direction, setDirection] = useState<number>(0);

  // 首載 / 路由 query 變動（含上一頁、分享連結）時，從 URL 還原已選路線；
  // routeUid 相同則保留現有物件（含完整起訖資訊），避免被 URL 精簡版覆蓋。
  useEffect(() => {
    if (!router.isReady) return;
    const fromUrl = parseRouteFromQuery(router.query);
    setSelectedRoute((prev) =>
      prev && fromUrl && prev.routeUid === fromUrl.routeUid ? prev : fromUrl,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    router.isReady,
    router.query.routeUid,
    router.query.source,
    router.query.city,
  ]);

  // 依 URL dir 設方向：從站牌看板點某向進來自動切到對應 tab，一般選路線(無 dir)預設去程。
  // deps 含 router.query.dir，讓 push 帶的 dir 落地後補正（避開與 setSelectedRoute 的 race）
  useEffect(() => {
    const raw = router.query.dir;
    const d = typeof raw === "string" ? Number(raw) : NaN;
    setDirection(Number.isFinite(d) ? d : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoute?.routeUid, router.query.dir]);

  const selection: BusRouteSelection | null = selectedRoute
    ? {
        routeUid: selectedRoute.routeUid,
        source: selectedRoute.source,
        city: selectedRoute.city,
      }
    : null;

  // 路線看板（route 模式）
  const routeArrivals = useBusRouteArrivals(selection);
  const { data } = routeArrivals;

  // 公車歷史（BUS）：查過的路線；常用路線由搜尋列愛心 / 面板愛心經 StationFavoritesContext 管理
  const { saveHistory: saveBusHistory } = useStationHistory("BUS");
  // 看板載入成功即寫入歷史（meta 帶 source/city 供重查）；以 routeUid guard 避免輪詢重複寫
  const lastSavedRoute = useRef<string | null>(null);
  useEffect(() => {
    if (!selectedRoute || data == null) return;
    if (lastSavedRoute.current === selectedRoute.routeUid) return;
    lastSavedRoute.current = selectedRoute.routeUid;
    saveBusHistory({
      targetId: selectedRoute.routeUid,
      targetName: selectedRoute.routeName,
      meta: encodeBusMeta(selectedRoute.source, selectedRoute.city),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoute, data]);

  // 站牌看板（stop 模式，URL ?stopCity=&stopName=，與 routeUid 互斥）
  const stopCity =
    typeof router.query.stopCity === "string" ? router.query.stopCity : null;
  const stopName =
    typeof router.query.stopName === "string" ? router.query.stopName : null;
  const stopSelection: BusStopSelection | null =
    stopCity && stopName ? { city: stopCity, stopName } : null;
  const stopBoard = useBusStopBoard(stopSelection);
  const isStopMode = !!stopSelection;

  // 依模式取作用中看板的共用狀態（data 型別不同故各自取）
  const active = isStopMode ? stopBoard : routeArrivals;
  const {
    error,
    isLoading,
    lastUpdatedAt,
    isAutoRefresh,
    nextUpdateAt,
    refresh,
    isIdle,
    resumeAutoRefresh,
  } = active;

  // 手動刷新冷卻（route/stop 共用一份；refresh 指向作用中看板）；冷卻中再按 → 彈窗「請於 X 秒後再試」
  const busRefreshCooldown = useRefreshCooldown(POLL_INTERVAL_MS);
  const handleRefresh = () => busRefreshCooldown.attempt(refresh);
  // 同查詢冷卻：選同路線 / 定位到同站牌 5 秒內擋下並提示（按 key 區分，不同查詢不互擋），比照 TR 單站
  const busQueryCooldown = useRefreshCooldown(SAME_QUERY_COOLDOWN_MS);
  // 換路線/換站牌：新查詢可立即刷新
  useEffect(() => {
    busRefreshCooldown.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoute?.routeUid, stopCity, stopName]);

  // 離我最近站牌：定位解析後 push URL（清掉 route 改 stop 模式）；push 留歷史讓瀏覽器可返回
  // 同站牌 5 秒內重定位 → 擋下並提示（key 帶站牌）
  const handleNearestStop = (stop: JsyBusNearestStop) => {
    busQueryCooldown.attempt(() => {
      setSelectedRoute(null);
      router.push(
        {
          pathname: "/bus",
          query: { stopCity: stop.city, stopName: stop.stopName },
        },
        undefined,
        { shallow: true },
      );
    }, `stop:${stop.city}|${stop.stopName}`);
  };
  const { locate, geoError } = useNearestBusStop(handleNearestStop);

  // 路線詳細資訊（業者/票價/路線圖/時刻表）：選定即抓，供 modal 顯示
  const {
    info: routeInfo,
    isLoading: infoLoading,
    error: infoError,
  } = useBusRouteInfo(selection);
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  // 選定路線 → 更新 state + 淺層 push URL（不重跑 GSSP）；push 留歷史讓瀏覽器可返回
  // dir（站牌看板點某向進來時帶）寫進 URL，讓 route board 初始化即切到對應 tab
  // 同路線 5 秒內重選 → 擋下並提示（key 帶 routeUid）
  const handleSelectRoute = (route: JsyBusRoute, dir?: number) => {
    busQueryCooldown.attempt(() => {
      gaClickEvent(GaEnum.BUS_ROUTE_SELECT);
      setSelectedRoute(route);
      router.push(
        {
          pathname: "/bus",
          query: {
            routeUid: route.routeUid,
            source: route.source,
            ...(route.city ? { city: route.city } : {}),
            name: route.routeName,
            ...(dir != null ? { dir: String(dir) } : {}),
          },
        },
        undefined,
        { shallow: true },
      );
    }, `route:${route.routeUid}`);
  };

  // 切換方向 → 更新 state + 寫 URL dir（replace 不增歷史，與 TR 一致）；refresh/分享可還原
  const handleDirectionChange = (dir: number) => {
    setDirection(dir);
    router.replace(
      { pathname: "/bus", query: { ...router.query, dir: String(dir) } },
      undefined,
      { shallow: true },
    );
  };

  // 站牌看板某列 → 跳該路線看板（站牌看板恆為市區公車，source 固定 city、city 取看板所在縣市）
  // 帶該列的 direction，讓 route board 直接切到對應方向 tab（方向 index 兩看板一致）
  const handleSelectStopRoute = (route: JsyBusStopBoardRoute) => {
    handleSelectRoute(
      {
        routeUid: route.routeUid,
        routeName: route.routeName,
        source: "city",
        city: stopBoard.data?.city,
        departureStop: "",
        destinationStop: route.destination,
        routeType: 0,
      },
      route.direction,
    );
  };

  // 底部廣告：mount 後才掛（比照其他頁，避免 SSR/hydration 掛 adsbygoogle）
  const [showBottomAd, setShowBottomAd] = useState(false);
  useEffect(() => {
    setShowBottomAd(true);
  }, []);

  // 登入會員：自動輪詢倒數環，掛在方向切換同列最右（cornerSlot），不額外佔一列
  const autoRefreshRing =
    isAutoRefresh && nextUpdateAt != null ? (
      <BusAutoRefreshRing
        nextUpdateAt={nextUpdateAt}
        intervalMs={POLL_INTERVAL_MS}
      />
    ) : null;

  // 未登入：手動刷新（冷卻中再按彈窗提示 + 引導登入解鎖自動更新）
  const refreshControls =
    !isAutoRefresh && (lastUpdatedAt || error) ? (
      <RefreshButton onRefresh={handleRefresh} />
    ) : null;

  // 路線詳細資訊：icon-only，掛在方向切換同列最左（leadingSlot）；無看板時退回置中列
  const routeInfoButton = (
    <button
      type="button"
      onClick={() => setInfoModalOpen(true)}
      aria-label={t("busRouteInfo")}
      className="custom-cursor-pointer inline-flex text-zinc-600 dark:text-zinc-300"
    >
      <InfoIcon />
    </button>
  );

  // 收藏 target（當前選定路線）；route_uid 不足以重查，meta 帶 source/city
  const busFavoriteTarget: StationTarget | null = selectedRoute
    ? {
        targetId: selectedRoute.routeUid,
        targetName: selectedRoute.routeName,
        meta: encodeBusMeta(selectedRoute.source, selectedRoute.city),
      }
    : null;
  // 愛心出現在兩處（搜尋列「離我最近站牌」同列最右 + 看板吸頂時路線名同列最右），
  // 依捲動位置互斥可見；各處各自建立實例，不共用同一 element。
  const renderBusFavorite = () =>
    busFavoriteTarget ? (
      <StationFavoriteButton trainType="BUS" target={busFavoriteTarget} />
    ) : null;

  return (
    <>
      <PageSeo />
      <MuiThemeProvider theme={muiTheme}>
        <Layout>
          <div className="mx-auto w-full max-w-xl">
            <BusRouteSearch
              selectedRoute={selectedRoute}
              onSelect={handleSelectRoute}
            />

            {/* 離我最近站牌（定位 → 該站牌所有路線即時到站）：列滿版，按鈕置中、收藏愛心 absolute 掛最右，
                與下方看板的倒數環 / 刷新鈕同在內容右緣對齊（搜尋框雖窄，控制項統一靠右） */}
            <div className="mt-4 flex flex-col items-center gap-1">
              <div className="relative flex w-full justify-center">
                <Button
                  variant="light"
                  size="sm"
                  className="text-sm"
                  startContent={<LocateIcon className="h-4 w-4" />}
                  // endContent={<span aria-hidden className="" />}
                  onPress={locate}
                >
                  {t("busNearestStop")}
                </Button>
                {busFavoriteTarget && (
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    {renderBusFavorite()}
                  </div>
                )}
              </div>
              {geoError && (
                <div className="mb-2 mt-2 text-center text-xs text-red-600 dark:text-red-400">
                  {geoError}
                </div>
              )}
            </div>

            {/* 未選路線且非站牌模式時顯示歷史 / 常用路線（選路線後由看板取代，比照 OD 首頁→搜尋頁） */}
            {!selectedRoute && !isStopMode && (
              <div className="mt-3 text-center empty:hidden">
                <StationHistoryPanel
                  trainType="BUS"
                  onSelect={(target: StationTarget) => {
                    const { source, city } = decodeBusMeta(target.meta);
                    handleSelectRoute({
                      routeUid: target.targetId,
                      routeName: target.targetName,
                      source,
                      city,
                      departureStop: "",
                      destinationStop: "",
                      routeType: 0,
                    });
                  }}
                  // 次要標籤：縣市（市區公車）或來源（公路客運 / 台灣好行），區分同名不同路線（如台中 vs 新竹 182）
                  resolveSubLabel={(target) => {
                    const { source, city } = decodeBusMeta(target.meta);
                    return source === "city" && city
                      ? t(`busCity.${city}`, { defaultValue: city })
                      : t(SOURCE_LABEL_KEY[source]);
                  }}
                />
              </div>
            )}

            {/* 站牌模式：定位到的站牌、其所有路線即時到站 */}
            {isStopMode && (
              <div className="mt-5">
                {/* 站名置中；倒數環/刷新 absolute 掛同列最右，不影響置中 */}
                <div className="relative mb-3 flex items-center justify-center">
                  <span className="text-base font-bold">{stopName}</span>
                  {(autoRefreshRing ?? refreshControls) && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2">
                      {autoRefreshRing ?? refreshControls}
                    </div>
                  )}
                </div>
                {stopBoard.data ? (
                  <>
                    <BusStopBoard
                      board={stopBoard.data}
                      onSelectRoute={handleSelectStopRoute}
                    />
                    {/* 站牌路線清單下方廣告（trainInfo 大版）；mt-2 對齊清單 gap-2 */}
                    {AdUtils.showAd(0, 0) && (
                      <div className="mt-2">
                        <AdBanner mode="trainInfo" />
                      </div>
                    )}
                  </>
                ) : (
                  error && <NoTrainData apiError={error} />
                )}
              </div>
            )}

            {selectedRoute && (
              <div className="mt-1">
                {data && data.length > 0 ? (
                  // 有看板：方向切換同列左掛詳細資訊、右掛角落槽（登入倒數環 / 未登入刷新+登入引導，互斥）
                  <BusRouteBoard
                    boards={data}
                    direction={direction}
                    onDirectionChange={handleDirectionChange}
                    routeName={selectedRoute.routeName}
                    leadingSlot={routeInfoButton}
                    cornerSlot={autoRefreshRing ?? refreshControls}
                    favoriteSlot={renderBusFavorite()}
                  />
                ) : (
                  <>
                    {/* 無看板時：詳細資訊 + 刷新退回置中列（無方向 tab 可掛） */}
                    <div className="mb-3 flex items-center justify-center gap-3">
                      {routeInfoButton}
                      {refreshControls}
                    </div>
                    {error && <NoTrainData apiError={error} />}
                    {!error && data && data.length === 0 && (
                      <div className="rounded-xl border border-solid border-foreground p-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
                        {t("busNoRealtime")}
                      </div>
                    )}
                    {/* 查過 TDX 即有廣告：錯誤 / 無即時班次也顯示（同 TR OD NoTrainData，trainInfo 大版）；載入中不掛 */}
                    {AdUtils.showAd(0, 0) &&
                      (error || (data != null && data.length === 0)) && (
                        <div className="mt-4">
                          <AdBanner mode="trainInfo" />
                        </div>
                      )}
                  </>
                )}
              </div>
            )}

            {selectedRoute && (
              <BusRouteInfoModal
                open={infoModalOpen}
                setOpen={setInfoModalOpen}
                route={selectedRoute}
                info={routeInfo}
                isLoading={infoLoading}
                error={infoError}
              />
            )}

            {/* 手動刷新冷卻提示（凍結秒數）+ 引導登入解鎖自動更新（取代原 info 按鈕） */}
            <CommonDialog
              open={busRefreshCooldown.dialogOpen}
              setOpen={busRefreshCooldown.setDialogOpen}
              cancelText="cancel"
              confirmText="login"
              onConfirm={() => {
                gaClickEvent(GaEnum.LOGIN_WITH_GOOGLE);
                void loginWithGoogle();
              }}
            >
              <div className="flex flex-col gap-2">
                <p>
                  {t("sameQueryCountdownMsg", {
                    seconds: busRefreshCooldown.frozenSeconds,
                  })}
                </p>
                <p className="text-sm text-primary">
                  {t("busAutoRefreshHint")}
                </p>
              </div>
            </CommonDialog>

            {/* 同查詢冷卻提示（選同路線 / 定位同站牌 5 秒內），比照 TR 單站 */}
            <CommonDialog
              open={busQueryCooldown.dialogOpen}
              setOpen={busQueryCooldown.setDialogOpen}
            >
              {t("sameQueryCountdownMsg", {
                seconds: busQueryCooldown.frozenSeconds,
              })}
            </CommonDialog>

            {/* 久無操作暫停自動更新：任何關閉動作（繼續更新 / X / 背景 / Esc）都代表使用者在場 → 恢復輪詢 */}
            <CommonDialog
              open={isIdle}
              setOpen={(o) => {
                if (!o) resumeAutoRefresh();
              }}
              title="autoRefreshIdleTitle"
              confirmText="autoRefreshIdleConfirm"
            >
              {t("autoRefreshIdleMsg")}
            </CommonDialog>
          </div>

          {isLoading && <Loading />}

          {/* 底部可關閉廣告：有查詢(站牌/路線)才掛；單頁 shallow 不 unmount → 關閉狀態跨模式延續 */}
          {AdUtils.showAd(0, 0) &&
            showBottomAd &&
            (isStopMode || selectedRoute) && <AdBanner mode="bottom" />}
        </Layout>
      </MuiThemeProvider>
    </>
  );
};

export default BusPage;
