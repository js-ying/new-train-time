import BusFavoriteStopBoard from "@/components/bus/BusFavoriteStopBoard";
import BusLocateBar from "@/components/bus/BusLocateBar";
import { BusRouteStopHighlight } from "@/components/bus/BusRouteBoard";
import BusRouteSearch from "@/components/bus/BusRouteSearch";
import QueryCooldownDialog from "@/components/common/QueryCooldownDialog";
import Layout from "@/components/layout/Layout";
import PopularBusRoutes from "@/components/search-area/PopularBusRoutes";
import PageSeo from "@/components/seo/PageSeo";
import StationHistoryPanel from "@/components/station-history/StationHistoryPanel";
import { GaEnum } from "@/enums/GaEnum";
import { PathEnum } from "@/enums/PathEnum";
import useNearestBusStop from "@/hooks/search/useNearestBusStop";
import useMuiTheme from "@/hooks/useMuiTheme";
import useRefreshCooldown, {
  QUERY_COOLDOWN_MS,
} from "@/hooks/useRefreshCooldown";
import useRouteChangePending from "@/hooks/useRouteChangePending";
import useStationFavorites from "@/hooks/useStationFavorites";
import { JsyBusNearestStop, JsyBusRoute } from "@/models/jsy-bus-info";
import { JsyPopularStation } from "@/models/jsy-popular-stations";
import { StationTarget } from "@/models/station-history";
import { fetchPopularStations } from "@/services/popularStationsService";
import { setPendingBusSelection } from "@/utils/BusPendingSelection";
import { parseBusStopFavoriteId } from "@/utils/BusStopFavoriteUtils";
import {
  buildBusRouteQuery,
  busTargetToRoute,
  decodeBusMeta,
  encodeBusTargetId,
  SOURCE_LABEL_KEY,
} from "@/utils/BusUtils";
import { gaClickEvent } from "@/utils/GaUtils";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import type { GetStaticPropsContext } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";

interface BusHomeProps {
  /** 熱門公車路線（後端取不到時為空陣列） */
  popularBusRoutes: JsyPopularStation[];
}

// 熱門路線烤進靜態頁，ISR 每小時重生（同三鐵首頁）
export async function getStaticProps({ locale }: GetStaticPropsContext) {
  const [translations, popularBusRoutes] = await Promise.all([
    serverSideTranslations(locale),
    fetchPopularStations("BUS"),
  ]);
  return {
    props: { ...translations, popularBusRoutes },
    revalidate: 3600,
  };
}

/** [頁面] 公車首頁：路線搜尋、離我最近站牌、歷史 / 常用 / 收藏站點、熱門路線；選定後進查詢頁。 */
const BusHome: FC<BusHomeProps> = ({ popularBusRoutes }) => {
  const muiTheme = useMuiTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const isNavigating = useRouteChangePending();

  // 已在公車首頁再點 TrainSwitch「公車」/ 標題時頁面不會 remount，改 key 把搜尋面板重置為初始
  const [routeSearchResetKey, setRouteSearchResetKey] = useState(0);
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (url.split("?")[0].endsWith(PathEnum.busHome)) {
        setRouteSearchResetKey((k) => k + 1);
      }
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => router.events.off("routeChangeComplete", handleRouteChange);
  }, [router.events]);

  // 收藏站點（BUS_STOP，站牌×路線×方向）；舊版純 stopUid 收藏解析失敗即清除
  const {
    favoriteList: stopFavoriteList,
    removeFavorite: removeStopFavorite,
    reorderFavorites: reorderStopFavorites,
  } = useStationFavorites("BUS_STOP");
  const validStopFavorites = stopFavoriteList.filter(
    (f) => parseBusStopFavoriteId(f.targetId) !== null,
  );
  useEffect(() => {
    for (const f of stopFavoriteList) {
      if (!parseBusStopFavoriteId(f.targetId)) removeStopFavorite(f.targetId);
    }
  }, [stopFavoriteList, removeStopFavorite]);

  // 同查詢冷卻；導頁進行中直接略過、不進冷卻
  const busQueryCooldown = useRefreshCooldown(QUERY_COOLDOWN_MS);

  // 選定路線 → 記下主動選擇後進查詢頁（查詢頁據此寫歷史、切方向、捲到該站）
  const handleSelectRoute = (
    route: JsyBusRoute,
    opts?: { dir?: number; highlight?: BusRouteStopHighlight },
  ) => {
    if (isNavigating) return;
    const key = encodeBusTargetId(route.routeUid, route.subRouteName);
    busQueryCooldown.attempt(
      () => {
        gaClickEvent(GaEnum.BUS_ROUTE_SELECT);
        setPendingBusSelection({ key, route, highlight: opts?.highlight });
        router.push({
          pathname: PathEnum.busSearch,
          query: buildBusRouteQuery(
            route.routeUid,
            route.subRouteName,
            opts?.dir,
          ),
        });
      },
      { key: `route:${key}` },
    );
  };

  // 離我最近站牌 → 進查詢頁的站牌看板
  const handleNearestStop = (stop: JsyBusNearestStop) => {
    if (isNavigating) return;
    busQueryCooldown.attempt(
      () => {
        router.push({
          pathname: PathEnum.busSearch,
          query: { stopUid: stop.stopUid },
        });
      },
      { key: `stopuid:${stop.stopUid}` },
    );
  };
  const {
    locate,
    geoError,
    notFound: nearestNotFound,
  } = useNearestBusStop(handleNearestStop);

  return (
    <>
      <PageSeo />
      <MuiThemeProvider theme={muiTheme}>
        <Layout>
          <div className="mx-auto w-full">
            <BusRouteSearch
              key={routeSearchResetKey}
              selectedRoute={null}
              onSelect={handleSelectRoute}
            />

            <BusLocateBar
              onLocate={locate}
              geoError={geoError}
              notFound={nearestNotFound}
            />

            {/* 歷史 / 常用路線、收藏站點 */}
            <div className="mt-2 text-center empty:hidden">
              <StationHistoryPanel
                trainType="BUS"
                onSelect={(target: StationTarget) =>
                  handleSelectRoute(busTargetToRoute(target))
                }
                // 次要標籤：縣市（市區公車）或來源（公路客運 / 台灣好行），區分同名不同路線（如台中 vs 新竹 182）
                resolveSubLabel={(target) => {
                  const { source, city } = decodeBusMeta(target.meta);
                  return source === "city" && city
                    ? t(`busCity.${city}`, { defaultValue: city })
                    : t(SOURCE_LABEL_KEY[source]);
                }}
                // 點卡片 → 跳該路線看板、切到收藏方向並捲到該站
                stopFavorites={{
                  count: validStopFavorites.length,
                  content: (
                    <div className="mx-auto w-full md:max-w-md">
                      <BusFavoriteStopBoard
                        favorites={validStopFavorites}
                        onSelect={(key, names) =>
                          handleSelectRoute(
                            {
                              routeUid: key.routeUid,
                              routeName: names.routeName,
                              routeNameEn: names.routeNameEn,
                              subRouteName: key.subRouteName,
                              // 收藏不存 source/city；後端依 routeUid 反查索引（同冷開連結）
                              source: "city",
                              departureStop: "",
                              destinationStop: "",
                              routeType: 0,
                            },
                            {
                              dir: key.direction,
                              highlight: { ...key, stopName: names.stopName },
                            },
                          )
                        }
                        onRemove={removeStopFavorite}
                        onReorder={reorderStopFavorites}
                      />
                    </div>
                  ),
                }}
              />
            </div>

            {/* 熱門路線快查；顯示與否同首頁熱門路線，由 _document、SettingContext 控制 */}
            <div className="js-popular-routes mt-6">
              <PopularBusRoutes
                routes={popularBusRoutes}
                // 熱門藥丸算主動選擇：查詢頁看板載入後寫歷史
                onSelectRoute={(uid, sub) => {
                  setPendingBusSelection({ key: encodeBusTargetId(uid, sub) });
                }}
              />
            </div>

            {/* 同查詢冷卻提示（選同路線 / 定位同站牌），比照 TR 單站 */}
            <QueryCooldownDialog cooldown={busQueryCooldown} />
          </div>
        </Layout>
      </MuiThemeProvider>
    </>
  );
};

export default BusHome;
