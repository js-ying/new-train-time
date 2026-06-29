import AdBanner from "@/components/common/AdBanner";
import CommonDialog from "@/components/common/CommonDialog";
import Loading from "@/components/common/Loading";
import RefreshButton from "@/components/common/RefreshButton";
import Layout from "@/components/layout/Layout";
import DynamicAnnouncements from "@/components/search-area/alert/DynamicAnnouncements";
import OperationAlert from "@/components/search-area/alert/OperationAlert";
import StationFavoriteButton from "@/components/station-history/StationFavoriteButton";
import StationHistoryPanel from "@/components/station-history/StationHistoryPanel";
import NoTrainData from "@/components/train-time-table/NoTrainData";
import TrStationPageSeo from "@/components/train-time-table/TR/station/TrStationPageSeo";
import TrStationPicker from "@/components/train-time-table/TR/station/TrStationPicker";
import TrStationTimeTable from "@/components/train-time-table/TR/station/TrStationTimeTable";
import { GaEnum } from "@/enums/GaEnum";
import useTrStationTimetable from "@/hooks/search/useTrStationTimetable";
import useMuiTheme from "@/hooks/useMuiTheme";
import useRefreshCooldown from "@/hooks/useRefreshCooldown";
import useStationHistory from "@/hooks/useStationHistory";
import { JsyTrStationTimetable } from "@/models/jsy-tr-info";
import { StationTarget } from "@/models/station-history";
import { fetchTrStationTimetableServerSide } from "@/services/trStationTimetableServerService";
import AdUtils from "@/utils/AdUtils";
import { gaClickEvent } from "@/utils/GaUtils";
import { getTrStationNameById, isValidTrStationId } from "@/utils/StationUtils";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { GetServerSidePropsContext } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useEffect, useRef, useState } from "react";

interface StationPageProps {
  initialStationId: string | null;
  initialDir: "north" | "south" | null;
  initialData: JsyTrStationTimetable | null;
}

// i18n + 站/方向 query 解析；帶站時於 server 取好時刻表寫進 HTML（SSR）
export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { locale, query } = ctx;
  const rawStation = typeof query.station === "string" ? query.station : null;
  const stationId =
    rawStation && isValidTrStationId(rawStation) ? rawStation : null;
  const initialDir =
    query.dir === "north" || query.dir === "south" ? query.dir : null;

  // GSSP 在 Next server 上跑、可達後端；取數失敗回 null 由 client 補抓
  const initialData = stationId
    ? await fetchTrStationTimetableServerSide(stationId)
    : null;

  return {
    props: {
      ...(await serverSideTranslations(locale)),
      initialStationId: stationId,
      initialDir,
      initialData,
    },
  };
}

/**
 * 決定要顯示的方向（無「全部」選項）：
 * 優先用 URL 指定的 north/south（須該方向有車）→ 否則預設北上（須有車）→ 否則第一個有車方向。
 * 只在「有車的方向」中挑，避免選到空方向（如基隆北上=終點站無北上車）。
 */
const resolveDirection = (
  dir: "north" | "south" | null,
  data: JsyTrStationTimetable | null,
): number => {
  const dirs = data?.directions.filter((d) => d.terminals.length > 0) ?? [];
  if (dirs.length === 0) return 0;
  if (dir) {
    const req = dirs.find((d) => d.northSouth === dir);
    if (req) return req.direction;
  }
  const north = dirs.find((d) => d.northSouth === "north");
  return (north ?? dirs[0]).direction;
};

/** [頁面] 台鐵單站方向別時刻表（北上/南下時刻表） */
const StationTimetablePage: FC<StationPageProps> = ({
  initialStationId,
  initialDir,
  initialData,
}) => {
  const muiTheme = useMuiTheme();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { data, error, isLoading, fetchStation, reset } = useTrStationTimetable(
    initialStationId,
    initialData,
  );
  // 單站歷史（TR）：查過的車站；常用車站由 picker 愛心 / 面板愛心經 StationFavoritesContext 管理
  const { saveHistory: saveStationHistory } = useStationHistory("TR");

  const [selectedStationId, setSelectedStationId] = useState<string | null>(
    initialStationId,
  );
  const [directionFilter, setDirectionFilter] = useState<number>(
    resolveDirection(initialDir, initialData),
  );
  // 重新整理目前車站時刻表的 5s 冷卻（誤點資訊不開放自動輪詢，僅手動刷新）；
  // 冷卻中再按 → 彈窗提示「請於 X 秒後再試」（比照 OD/單站 sameQuery）
  const refreshCooldown = useRefreshCooldown(5000);
  const handleRefresh = () => {
    if (!selectedStationId) return;
    refreshCooldown.attempt(() => fetchStation(selectedStationId));
  };

  // 換站取得新資料後，把方向重設為該站預設（北上或第一個有車方向）；
  // ref 守住首載：SSR 帶站時不覆寫 initialDir 解析出的初值。
  const lastResolvedStation = useRef(initialStationId);
  useEffect(() => {
    if (data && data.stationId !== lastResolvedStation.current) {
      lastResolvedStation.current = data.stationId;
      // 返回/前進到帶 dir 的 URL 時還原該方向；一般選站 URL 無 dir → 預設方向
      const urlDir =
        router.query.dir === "north" || router.query.dir === "south"
          ? router.query.dir
          : null;
      setDirectionFilter(resolveDirection(urlDir, data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // 只記「主動選擇」(picker / 定位 / 歷史面板點選)；URL 直連 / 冷載還原不寫歷史。
  // 以 stationId 為 guard 避免同站重複寫，換語言不重存（站名由面板即時重解析）
  const activeSelectRef = useRef<string | null>(null);
  const lastSavedStation = useRef<string | null>(null);
  useEffect(() => {
    const sid = data?.stationId;
    if (!sid || activeSelectRef.current !== sid) return;
    if (lastSavedStation.current === sid) return;
    lastSavedStation.current = sid;
    saveStationHistory({
      targetId: sid,
      targetName: getTrStationNameById(sid, i18n.language) ?? sid,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // 瀏覽器返回/前進改了 URL station（非經 picker）→ 同步重查；經 picker 選站時 state 已同步、此處 no-op
  useEffect(() => {
    if (!router.isReady) return;
    const urlStation =
      typeof router.query.station === "string" &&
      isValidTrStationId(router.query.station)
        ? router.query.station
        : null;
    if (urlStation === selectedStationId) return;
    setSelectedStationId(urlStation);
    refreshCooldown.reset();
    if (urlStation) fetchStation(urlStation);
    else reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query.station]);

  // 選站（picker 或定位）→ 重查 + 淺層 push URL（留歷史可返回、不重跑 GSSP）；方向待新資料到位由上方 effect 重設
  // 「同站太快重複查詢」的攔截在 TrStationPicker.select()（三入口都經它），此處不再重複擋
  const handleSelectStation = (stationId: string) => {
    activeSelectRef.current = stationId; // 標記為主動選擇（歷史只記主動選擇，URL 直連不記）
    setSelectedStationId(stationId);
    fetchStation(stationId);
    refreshCooldown.reset(); // 換站資料已新鮮，刷新冷卻歸零
    router.push(
      { pathname: "/station", query: { station: stationId } },
      undefined,
      { shallow: true },
    );
  };

  // 方向篩選變動 → 同步 dir 進 URL（僅西部主線 north/south 才寫）
  const handleDirectionChange = (value: number) => {
    setDirectionFilter(value);
    const dirInfo = data?.directions.find((d) => d.direction === value);
    const dirParam = dirInfo?.showNorthSouth ? dirInfo.northSouth : undefined;
    router.replace(
      {
        pathname: "/station",
        query: {
          ...(selectedStationId ? { station: selectedStationId } : {}),
          ...(dirParam ? { dir: dirParam } : {}),
        },
      },
      undefined,
      { shallow: true },
    );
  };

  // 點標題回到初始空白選站狀態：清 UI state 與資料，URL 由 Link 收回 /station
  const handleResetToInitial = () => {
    gaClickEvent(GaEnum.STATION_TIMETABLE);
    setSelectedStationId(null);
    setDirectionFilter(0);
    lastResolvedStation.current = null;
    refreshCooldown.reset();
    reset();
  };

  // 底部廣告：mount 後才掛（比照 OD，避免 SSR/hydration 掛 adsbygoogle）
  const [showBottomAd, setShowBottomAd] = useState(false);
  useEffect(() => {
    setShowBottomAd(true);
  }, []);

  const hasData = !!data && data.timeTables.length > 0;

  return (
    <>
      <TrStationPageSeo
        stationId={selectedStationId}
        directionFilter={directionFilter}
        data={data}
      />
      <MuiThemeProvider theme={muiTheme}>
        <Layout>
          {/* 標題水平置中；營運狀態圓點以 absolute 掛在文字右側，不佔 flow、不影響置中 */}
          <h1 className="text-center text-base font-bold">
            <span className="relative inline-block">
              {/* 點標題回 /station（清掉站/方向參數，回初始）— 同 sidebar 入口 */}
              <Link
                href="/station"
                onClick={handleResetToInitial}
                className="cursor-pointer"
              >
                {t("trStationBoardPageTitle")}
              </Link>
              <span className="absolute left-full top-1/2 -translate-y-1/2">
                <OperationAlert compact />
              </span>
            </span>
          </h1>

          {/* 電腦版收成置中窄欄（比照手機版密度，避免卡片過寬、內容偏左、中間留白） */}
          <div className="mx-auto mt-4 w-full">
            <TrStationPicker
              selectedStationId={selectedStationId}
              onSelectStation={handleSelectStation}
              // 收藏愛心掛在「離我最近車站」同列最右（對應 OD 時刻表愛心）；未選站不顯示
              rightSlot={
                selectedStationId ? (
                  <StationFavoriteButton
                    trainType="TR"
                    target={{
                      targetId: selectedStationId,
                      targetName:
                        getTrStationNameById(
                          selectedStationId,
                          i18n.language,
                        ) ?? selectedStationId,
                    }}
                  />
                ) : undefined
              }
            />

            {/* 未選站時顯示歷史 / 常用車站（選站後由時刻表取代，比照 OD 首頁→搜尋頁） */}
            {!selectedStationId && (
              <div className="mt-2 text-center empty:hidden">
                <StationHistoryPanel
                  trainType="TR"
                  onSelect={(target: StationTarget) =>
                    handleSelectStation(target.targetId)
                  }
                  resolveLabel={(target) =>
                    getTrStationNameById(target.targetId, i18n.language) ??
                    target.targetName
                  }
                />
              </div>
            )}

            <div className="mt-2">
              {data && data.announcements?.length > 0 && (
                <div className="mb-4">
                  <DynamicAnnouncements announcements={data.announcements} />
                </div>
              )}

              {hasData && (
                <TrStationTimeTable
                  data={data}
                  directionFilter={directionFilter}
                  onDirectionChange={handleDirectionChange}
                  // 刷新掛在北上/南下同列最右（absolute），與公車頁一致
                  cornerSlot={<RefreshButton onRefresh={handleRefresh} />}
                />
              )}

              {error && <NoTrainData apiError={error} isTr />}

              {!error && data && data.timeTables.length === 0 && (
                <NoTrainData isStation />
              )}
            </div>
          </div>

          {isLoading && <Loading />}

          {/* 手動刷新冷卻提示（比照 OD sameQuery，凍結秒數） */}
          <CommonDialog
            open={refreshCooldown.dialogOpen}
            setOpen={refreshCooldown.setDialogOpen}
          >
            {t("sameQueryCountdownMsg", {
              seconds: refreshCooldown.frozenSeconds,
            })}
          </CommonDialog>

          {/* 底部可關閉廣告：查過站才掛（首入未查詢、未打 TDX，不跳廣告） */}
          {AdUtils.showAd(0, 0) && showBottomAd && selectedStationId && (
            <AdBanner mode="bottom" />
          )}
        </Layout>
      </MuiThemeProvider>
    </>
  );
};

export default StationTimetablePage;
