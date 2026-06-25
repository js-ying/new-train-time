import BusRouteBoard from "@/components/bus/BusRouteBoard";
import BusRouteInfoModal from "@/components/bus/BusRouteInfoModal";
import BusRouteSearch from "@/components/bus/BusRouteSearch";
import AdBanner from "@/components/common/AdBanner";
import Loading from "@/components/common/Loading";
import Layout from "@/components/layout/Layout";
import PageSeo from "@/components/seo/PageSeo";
import NoTrainData from "@/components/train-time-table/NoTrainData";
import { GaEnum } from "@/enums/GaEnum";
import useBusRouteArrivals, {
  BusRouteSelection,
} from "@/hooks/search/useBusRouteArrivals";
import useBusRouteInfo from "@/hooks/search/useBusRouteInfo";
import useMuiTheme from "@/hooks/useMuiTheme";
import { BusSource, JsyBusRoute } from "@/models/jsy-bus-info";
import AdUtils from "@/utils/AdUtils";
import { gaClickEvent } from "@/utils/GaUtils";
import { Button } from "@heroui/react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { FC, useEffect, useState } from "react";

// i18n（公車頁為即時看板，不做 SSR 取數；資料於 client 抓 + 輪詢）
export async function getServerSideProps({ locale }: { locale: string }) {
  return { props: { ...(await serverSideTranslations(locale)) } };
}

const VALID_SOURCES: BusSource[] = ["city", "intercity", "taiwantrip"];

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

/** 時間戳 → HH:mm:ss（更新時間顯示用）。 */
const formatUpdatedTime = (ts: number): string => {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

/** 路線圖（摺疊地圖）icon。 */
const MapIcon: FC = () => (
  <svg
    viewBox="0 0 24 24"
    className="size-4"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
    />
  </svg>
);

/** 詳細資訊（i）icon。 */
const InfoIcon: FC = () => (
  <svg
    viewBox="0 0 24 24"
    className="size-4"
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

  // 換路線把方向重設為去程
  useEffect(() => {
    setDirection(0);
  }, [selectedRoute?.routeUid]);

  const selection: BusRouteSelection | null = selectedRoute
    ? {
        routeUid: selectedRoute.routeUid,
        source: selectedRoute.source,
        city: selectedRoute.city,
      }
    : null;

  const {
    data,
    error,
    isLoading,
    lastUpdatedAt,
    isPremium,
    isRefreshing,
    refresh,
  } = useBusRouteArrivals(selection);

  // 路線詳細資訊（業者/票價/路線圖/時刻表）：選定即抓，供「查看路線圖」外連與 modal 共用
  const {
    info: routeInfo,
    isLoading: infoLoading,
    error: infoError,
  } = useBusRouteInfo(selection);
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  // 選定路線 → 更新 state + 淺層寫 URL（不重跑 GSSP）
  const handleSelectRoute = (route: JsyBusRoute) => {
    gaClickEvent(GaEnum.BUS_ROUTE_SELECT);
    setSelectedRoute(route);
    router.replace(
      {
        pathname: "/bus",
        query: {
          routeUid: route.routeUid,
          source: route.source,
          ...(route.city ? { city: route.city } : {}),
          name: route.routeName,
        },
      },
      undefined,
      { shallow: true },
    );
  };

  // 底部廣告：mount 後才掛（比照其他頁，避免 SSR/hydration 掛 adsbygoogle）
  const [showBottomAd, setShowBottomAd] = useState(false);
  useEffect(() => {
    setShowBottomAd(true);
  }, []);

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

            {/* 路線圖外連（官方頁）+ 路線詳細資訊 modal 入口 */}
            {selectedRoute && (
              <div className="mt-3 flex flex-wrap items-center justify-center gap-1">
                {routeInfo?.routeMapImageUrl && (
                  <a
                    href={routeInfo.routeMapImageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm text-silverLakeBlue-500 hover:bg-zinc-100 dark:text-gamboge-500 dark:hover:bg-zinc-800"
                  >
                    <MapIcon />
                    {t("busViewRouteMap")}
                  </a>
                )}
                <Button
                  size="sm"
                  variant="light"
                  startContent={<InfoIcon />}
                  onPress={() => setInfoModalOpen(true)}
                  className="text-silverLakeBlue-500 dark:text-gamboge-500"
                >
                  {t("busRouteInfo")}
                </Button>
              </div>
            )}

            {selectedRoute && (
              <div className="mt-5">
                {/* 更新狀態列：有更新時間時顯示（premium 自動更新提示），或非會員遇錯需手動重試時露出按鈕 */}
                {(lastUpdatedAt || (error && !isPremium)) && (
                  <div className="mb-3 flex items-center justify-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                    {lastUpdatedAt && (
                      <span>
                        {t("busLastUpdated", {
                          time: formatUpdatedTime(lastUpdatedAt),
                        })}
                      </span>
                    )}
                    {isPremium ? (
                      lastUpdatedAt && (
                        <span className="text-emerald-600 dark:text-emerald-400">
                          {t("busAutoRefreshing")}
                        </span>
                      )
                    ) : (
                      <Button
                        size="sm"
                        variant="bordered"
                        isDisabled={isRefreshing}
                        onPress={refresh}
                        className="h-auto min-h-fit min-w-fit px-2 py-1 text-xs"
                      >
                        {t("busRefresh")}
                      </Button>
                    )}
                  </div>
                )}

                {data && data.length > 0 && (
                  <BusRouteBoard
                    boards={data}
                    direction={direction}
                    onDirectionChange={setDirection}
                  />
                )}

                {/* 有可用看板時不蓋錯誤（premium 輪詢失敗保留 stale 看板）；無資料才顯示錯誤 */}
                {error && !(data && data.length > 0) && (
                  <NoTrainData apiError={error} />
                )}

                {!error && data && data.length === 0 && (
                  <div className="rounded-xl border border-solid border-foreground p-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    {t("busNoRealtime")}
                  </div>
                )}
              </div>
            )}

            {selectedRoute && (
              <BusRouteInfoModal
                open={infoModalOpen}
                setOpen={setInfoModalOpen}
                title={selectedRoute.routeName}
                info={routeInfo}
                isLoading={infoLoading}
                error={infoError}
              />
            )}
          </div>

          {isLoading && <Loading />}

          {/* 底部可關閉廣告（mode=bottom） */}
          {AdUtils.showAd(0, 0) && showBottomAd && <AdBanner mode="bottom" />}
        </Layout>
      </MuiThemeProvider>
    </>
  );
};

export default BusPage;
