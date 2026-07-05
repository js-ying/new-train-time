import BusAutoRefreshRing from "@/components/bus/BusAutoRefreshRing";
import BusOperationAlert from "@/components/bus/BusOperationAlert";
import BusRouteBoard from "@/components/bus/BusRouteBoard";
import BusRouteInfoModal from "@/components/bus/BusRouteInfoModal";
import BusRouteSearch, {
  SOURCE_LABEL_KEY,
} from "@/components/bus/BusRouteSearch";
import BusStopBoard from "@/components/bus/BusStopBoard";
import BusStopVariantTabs from "@/components/bus/BusStopVariantTabs";
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
import { PathEnum } from "@/enums/PathEnum";
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
  JsyBusStopArrival,
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
  if (!routeUid) return null;

  // source/city 已不入 URL（後端依 routeUid 反查索引為權威）；舊連結若仍帶則沿用，否則預設 city。
  const source =
    typeof query.source === "string" &&
    VALID_SOURCES.includes(query.source as BusSource)
      ? (query.source as BusSource)
      : "city";
  const city = typeof query.city === "string" ? query.city : undefined;
  const subRouteName = typeof query.sub === "string" ? query.sub : undefined;
  return {
    routeUid,
    // 冷開/分享顯示名：子線用子線名（如 1822A）、route 粒度先佔位 routeUid，
    // arrivals 到位後由 useEffect 補權威值（子線名不覆寫；URL 不帶 name）
    routeName: subRouteName ?? routeUid,
    subRouteName,
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

/**
 * 歷史 / 收藏的 targetId 編解碼：含子線時 `routeUid|subRouteName`，否則純 routeUid。
 * 同 routeUid 多子線需各成一筆（key 唯一），舊純 routeUid 資料解出無子線＝route 粒度，相容。
 */
const encodeBusTargetId = (routeUid: string, subRouteName?: string): string =>
  subRouteName ? `${routeUid}|${subRouteName}` : routeUid;

const parseBusTargetId = (
  targetId: string,
): { routeUid: string; subRouteName?: string } => {
  const idx = targetId.indexOf("|");
  return idx < 0
    ? { routeUid: targetId }
    : {
        routeUid: targetId.slice(0, idx),
        subRouteName: targetId.slice(idx + 1) || undefined,
      };
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

  // 點 TrainSwitch「公車」分頁 / 瀏覽器返回導回乾淨 /bus（無 routeUid/stopUid）時，
  // 把路線搜尋面板重置為初始（收合輸入框、清空已輸入字）。改 key 觸發 remount 達成；
  // selectedRoute 已由下方 URL 還原 effect 清為 null，這裡只負責 BusRouteSearch 的本地 state。
  const [routeSearchResetKey, setRouteSearchResetKey] = useState(0);
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      const [path, qs = ""] = url.split("?");
      if (!path.endsWith(PathEnum.busHome)) return; // 導去別頁不重置
      const params = new URLSearchParams(qs);
      if (params.get("routeUid") || params.get("stopUid")) return; // 仍在看板不重置
      setRouteSearchResetKey((k) => k + 1);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => router.events.off("routeChangeComplete", handleRouteChange);
  }, [router.events]);

  // 首載 / 路由 query 變動（含上一頁、分享連結）時，從 URL 還原已選路線；
  // routeUid 相同則保留現有物件（含完整起訖資訊），避免被 URL 精簡版覆蓋。
  useEffect(() => {
    if (!router.isReady) return;
    const fromUrl = parseRouteFromQuery(router.query);
    // routeUid + 子線都相同才保留現有物件（含完整起訖）；換子線視為換查詢
    setSelectedRoute((prev) =>
      prev &&
      fromUrl &&
      prev.routeUid === fromUrl.routeUid &&
      prev.subRouteName === fromUrl.subRouteName
        ? prev
        : fromUrl,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query.routeUid, router.query.sub]);

  // 依 URL dir 設方向：從站牌看板點某向進來自動切到對應 tab，一般選路線(無 dir)預設去程。
  // deps 含 router.query.dir，讓 push 帶的 dir 落地後補正（避開與 setSelectedRoute 的 race）
  useEffect(() => {
    const raw = router.query.dir;
    const d = typeof raw === "string" ? Number(raw) : NaN;
    setDirection(Number.isFinite(d) ? d : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoute?.routeUid, selectedRoute?.subRouteName, router.query.dir]);

  // 站牌模式錨（?stopUid=，與 routeUid 互斥）：提前取得，供路線 selection 守互斥
  const stopUid =
    typeof router.query.stopUid === "string" ? router.query.stopUid : null;

  // 站牌模式下路線 selection 一律 null：防 URL 手動同帶 stopUid+routeUid 時兩看板都發請求/輪詢
  const selection: BusRouteSelection | null =
    selectedRoute && !stopUid
      ? {
          routeUid: selectedRoute.routeUid,
          source: selectedRoute.source,
          city: selectedRoute.city,
          subRouteName: selectedRoute.subRouteName,
        }
      : null;

  // 路線看板（route 模式）
  const routeArrivals = useBusRouteArrivals(selection);
  const { data } = routeArrivals;

  // URL 不帶 name：冷開/分享時 routeName 先佔位 routeUid，arrivals 到位後補成後端權威 routeName。
  // 只更新 routeName（不動 selection 鍵），故不會重抓看板；換路線時 parseRouteFromQuery 會先重置。
  useEffect(() => {
    const authoritativeName = data?.[0]?.routeName;
    if (!authoritativeName) return;
    setSelectedRoute((prev) => {
      if (!prev) return prev;
      // 子線顯示名固定為子線名（如 1822A）；arrivals 回的是原路線號（1822）不含子線，
      // 只有 route 粒度（無子線）才用它補權威顯示名
      const displayName = prev.subRouteName ?? authoritativeName;
      return prev.routeName !== displayName
        ? { ...prev, routeName: displayName }
        : prev;
    });
  }, [data]);

  // 防呆：dir 指向該路線不存在的方向（單向路線帶 dir=1、手改 URL）時，
  // 校正回看板第一個方向並同步 URL（replace 不留歷史），避免 state/URL 殘留無效值
  useEffect(() => {
    if (stopUid || !data || data.length === 0) return;
    if (data.some((b) => b.direction === direction)) return;
    const fallback = data[0].direction;
    setDirection(fallback);
    router.replace(
      { pathname: "/bus", query: { ...router.query, dir: String(fallback) } },
      undefined,
      { shallow: true },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, direction, stopUid]);

  // 公車歷史（BUS）：查過的路線；常用路線由搜尋列愛心 / 面板愛心經 StationFavoritesContext 管理
  const { saveHistory: saveBusHistory } = useStationHistory("BUS");
  // 只記「主動選擇」(搜尋/站牌/歷史點選)；直連/冷載還原不寫歷史。
  // 在看板載入後才存，以取後端回應的權威 source/city（跨縣市 meta 也正確）；routeUid guard 防輪詢重複寫。
  const activeSelectRef = useRef<string | null>(null);
  const lastSavedRoute = useRef<string | null>(null);
  useEffect(() => {
    if (!selectedRoute || data == null) return;
    // 歷史鍵含子線（routeUid|subRouteName），同路線不同子線各記一筆
    const key = encodeBusTargetId(
      selectedRoute.routeUid,
      selectedRoute.subRouteName,
    );
    if (activeSelectRef.current !== key) return;
    if (lastSavedRoute.current === key) return;
    lastSavedRoute.current = key;
    saveBusHistory({
      targetId: key,
      targetName: selectedRoute.routeName,
      // source/city 取後端回應的權威值（routeUid 反查索引），冷載/分享也正確
      meta: encodeBusMeta(
        data[0]?.source ?? selectedRoute.source,
        data[0]?.city ?? selectedRoute.city,
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoute, data]);

  // 站牌看板（stop 模式）：StopUID 為錨（與路線頁 routeUid 對稱）；
  // source/city/stopName 全由後端反查 bus_stop，前端不傳。
  const stopSelection: BusStopSelection | null = stopUid ? { stopUid } : null;
  const stopBoard = useBusStopBoard(stopSelection);
  const isStopMode = !!stopSelection;
  // 站牌頁標題：後端回的權威站名（單錨無 URL stopName，載入前留白由 loading 佔位）
  const stopDisplayName = stopBoard.data?.stopName || "";

  // 依模式取作用中看板的共用狀態（data 型別不同故各自取）
  const active = isStopMode ? stopBoard : routeArrivals;
  const {
    error,
    isLoading,
    lastUpdatedAt,
    isAutoRefresh,
    nextUpdateAt,
    pollIntervalMs,
    refresh,
    isIdle,
    resumeAutoRefresh,
  } = active;

  // 資料時效警示：後端標 isStale（TDX 異常回舊快照）或輪詢更新失敗（後端不可達、有舊資料）時，
  // 顯示看板資料的實際時間，避免舊到站被誤當即時
  const activeBoardUpdatedAt = isStopMode
    ? stopBoard.data?.updatedAt
    : data?.[0]?.updatedAt;
  const activeBoardIsStale = isStopMode
    ? !!stopBoard.data?.isStale
    : !!data?.[0]?.isStale;
  const staleWarning =
    activeBoardUpdatedAt != null && (activeBoardIsStale || error != null)
      ? t("busStaleDataWarning", {
          time: new Date(activeBoardUpdatedAt).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        })
      : null;
  const staleWarningBox = staleWarning ? (
    <div className="text-center text-xs text-amber-600 dark:text-amber-400">
      {staleWarning}
    </div>
  ) : null;

  // 路線營運通阻公告（arrivals 附帶、兩方向同組故取 [0]）；入口掛「離我最近站牌」列最左，
  // 未選路線 / 無公告時 BusOperationAlert 自回 null 不佔位
  const routeAlerts = !isStopMode ? data?.[0]?.alerts : undefined;

  // 手動刷新冷卻（route/stop 共用一份；refresh 指向作用中看板）；冷卻中再按 → 彈窗「請於 X 秒後再試」
  const busRefreshCooldown = useRefreshCooldown(POLL_INTERVAL_MS);
  const handleRefresh = () => busRefreshCooldown.attempt(refresh);
  // 同查詢冷卻：選同路線 / 定位到同站牌 5 秒內擋下並提示（按 key 區分，不同查詢不互擋），比照 TR 單站
  const busQueryCooldown = useRefreshCooldown(SAME_QUERY_COOLDOWN_MS);
  // 換路線/換站牌：新查詢可立即刷新
  useEffect(() => {
    busRefreshCooldown.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoute?.routeUid, selectedRoute?.subRouteName, stopUid]);

  // 離我最近站牌：定位解析後 push URL（StopUID 為錨，改 stop 模式）；push 留歷史讓瀏覽器可返回。
  // 不提前清 selectedRoute（避免閃歷史面板，同 handleSelectStopFromRoute）；同站牌 5 秒內重定位擋下。
  const handleNearestStop = (stop: JsyBusNearestStop) => {
    busQueryCooldown.attempt(() => {
      router.push(
        { pathname: "/bus", query: { stopUid: stop.stopUid } },
        undefined,
        { shallow: true },
      );
    }, `stopuid:${stop.stopUid}`);
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
    const key = encodeBusTargetId(route.routeUid, route.subRouteName);
    busQueryCooldown.attempt(() => {
      gaClickEvent(GaEnum.BUS_ROUTE_SELECT);
      activeSelectRef.current = key; // 標記為主動選擇（歷史只記主動選擇，直連/冷載不記）
      setSelectedRoute(route);
      // URL 不帶 name（後端不用；顯示名改取 arrivals 回應權威值，見下方 useEffect）
      router.push(
        {
          pathname: "/bus",
          query: {
            routeUid: route.routeUid,
            ...(route.subRouteName ? { sub: route.subRouteName } : {}),
            ...(dir != null ? { dir: String(dir) } : {}),
          },
        },
        undefined,
        { shallow: true },
      );
    }, `route:${key}`);
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

  // 站牌看板某列 → 跳該路線看板（source/city 取看板的權威值；公路客運/台灣好行 city 為空）
  // 帶該列的 subRouteName（展開候選才有）＋ direction：有 sub 精確導向該子線、無 sub 走 route 粒度，
  // 兩看板同粒度故到站時間天然一致（不經任何 fallback 轉換）。
  const handleSelectStopRoute = (route: JsyBusStopBoardRoute) => {
    handleSelectRoute(
      {
        routeUid: route.routeUid,
        routeName: route.subRouteName || route.routeName,
        subRouteName: route.subRouteName,
        source: stopBoard.data?.source ?? "city",
        city: stopBoard.data?.city || undefined,
        departureStop: "",
        destinationStop: route.destination,
        routeType: 0,
      },
      route.direction,
    );
  };

  // 路線站序某站 → 跳該站牌看板（StopUID 為錨，改 stop 模式），等於反向讓使用者搜站牌。
  // source 取路線權威值：市區公車站需在 bus_stop（city 有值）才查得到 → 無 city 不可點；
  // 公路客運/台灣好行 StopUID 直查、一律可點。同站 5 秒內重入擋下，比照 handleNearestStop。
  // 不在此提前清 selectedRoute：否則 URL 落地前會有一瞬 !selectedRoute && !isStopMode → 閃歷史面板；
  // 改靠 URL 落地後既有 useEffect 自動清，路線看板以 !isStopMode 守互斥，直接切站牌看板不抖動。
  const handleSelectStopFromRoute = (stop: JsyBusStopArrival) => {
    const source = data?.[0]?.source ?? selectedRoute?.source ?? "city";
    if (source === "city" && !stop.city) return; // 市區公車站需在 bus_stop（有 city）才查得到
    busQueryCooldown.attempt(() => {
      router.push(
        { pathname: "/bus", query: { stopUid: stop.stopUid } },
        undefined,
        { shallow: true },
      );
    }, `stopuid:${stop.stopUid}`);
  };

  // 站柱 tab 切換（同名多座標）→ push 該柱 stopUid（仍單錨）；已在此柱則不動
  const handleSelectVariant = (variantStopUid: string) => {
    if (variantStopUid === stopUid) return;
    busQueryCooldown.attempt(() => {
      router.push(
        { pathname: "/bus", query: { stopUid: variantStopUid } },
        undefined,
        { shallow: true },
      );
    }, `stopuid:${variantStopUid}`);
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
        intervalMs={pollIntervalMs}
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

  // 收藏 target（當前選定路線）；meta 帶 source/city 供副標顯示縣市/來源
  const busFavoriteTarget: StationTarget | null = selectedRoute
    ? {
        targetId: encodeBusTargetId(
          selectedRoute.routeUid,
          selectedRoute.subRouteName,
        ),
        targetName: selectedRoute.routeName,
        // source/city 優先取後端回應權威值（冷載/分享也正確）；看板未載入時退回 selectedRoute
        meta: encodeBusMeta(
          data?.[0]?.source ?? selectedRoute.source,
          data?.[0]?.city ?? selectedRoute.city,
        ),
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
              key={routeSearchResetKey}
              selectedRoute={selectedRoute}
              onSelect={handleSelectRoute}
            />

            {/* 離我最近站牌（定位 → 該站牌所有路線即時到站）：列滿版，按鈕置中、收藏愛心 absolute 掛最右，
                與下方看板的倒數環 / 刷新鈕同在內容右緣對齊（搜尋框雖窄，控制項統一靠右）；
                營運通阻公告入口 absolute 掛最左（有生效公告才顯示） */}
            <div className="mt-4 flex flex-col items-center gap-1">
              <div className="relative flex w-full justify-center">
                {/* left-3：dot-static 掛容器左外 0.8rem，留位避免圓點溢出內容區左緣 */}
                <div className="absolute inset-y-0 left-3 flex items-center">
                  <BusOperationAlert alerts={routeAlerts} />
                </div>
                <Button
                  variant="light"
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
              <div className="mt-2 text-center empty:hidden">
                <StationHistoryPanel
                  trainType="BUS"
                  onSelect={(target: StationTarget) => {
                    const { source, city } = decodeBusMeta(target.meta);
                    const { routeUid, subRouteName } = parseBusTargetId(
                      target.targetId,
                    );
                    handleSelectRoute({
                      routeUid,
                      routeName: target.targetName,
                      subRouteName,
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
                  <span className="text-base font-bold">{stopDisplayName}</span>
                  {(autoRefreshRing ?? refreshControls) && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2">
                      {autoRefreshRing ?? refreshControls}
                    </div>
                  )}
                </div>
                {staleWarningBox && <div className="mb-3">{staleWarningBox}</div>}
                {/* 同名多座標：站柱 tab（消防局松仁 4 柱），切柱＝push 該柱 stopUid */}
                {stopBoard.data?.variants &&
                  stopBoard.data.variants.length > 1 && (
                    <BusStopVariantTabs
                      variants={stopBoard.data.variants}
                      currentStopUid={stopUid ?? ""}
                      onSelect={handleSelectVariant}
                    />
                  )}
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

            {selectedRoute && !isStopMode && (
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
                    warningSlot={staleWarningBox}
                    onSelectStop={handleSelectStopFromRoute}
                  />
                ) : (
                  <>
                    {/* 詳細資訊 + 刷新退回置中列（無方向 tab 可掛）。
                        僅在載入完成但無看板（錯誤 / 無即時）時顯示；載入中不渲染，
                        避免與 BusRouteBoard 的左右分置方向列互換造成 info/refresh 位移抖動 */}
                    {(error || (data != null && data.length === 0)) && (
                      <div className="mb-3 flex items-center justify-center gap-3">
                        {routeInfoButton}
                        {refreshControls}
                      </div>
                    )}
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
