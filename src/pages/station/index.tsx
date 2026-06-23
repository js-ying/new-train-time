import CommonDialog from "@/components/common/CommonDialog";
import AdBanner from "@/components/common/AdBanner";
import Loading from "@/components/common/Loading";
import Layout from "@/components/layout/Layout";
import DynamicAnnouncements from "@/components/search-area/alert/DynamicAnnouncements";
import OperationAlert from "@/components/search-area/alert/OperationAlert";
import NoTrainData from "@/components/train-time-table/NoTrainData";
import TrStationPageSeo from "@/components/train-time-table/TR/station/TrStationPageSeo";
import TrStationPicker from "@/components/train-time-table/TR/station/TrStationPicker";
import TrStationTimeTable from "@/components/train-time-table/TR/station/TrStationTimeTable";
import useTrStationTimetable from "@/hooks/search/useTrStationTimetable";
import useMuiTheme from "@/hooks/useMuiTheme";
import { JsyTrStationTimetable } from "@/models/jsy-tr-info";
import { fetchTrStationTimetableServerSide } from "@/services/trStationTimetableServerService";
import { GaEnum } from "@/enums/GaEnum";
import AdUtils from "@/utils/AdUtils";
import { gaClickEvent } from "@/utils/GaUtils";
import { isValidTrStationId } from "@/utils/StationUtils";
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

/** 同一站重複查詢的最小間隔（毫秒），比照 OD sameQueryMsg */
const SAME_QUERY_INTERVAL_MS = 5000;

/** [頁面] 台鐵單站方向別時刻表（北上/南下時刻表） */
const StationTimetablePage: FC<StationPageProps> = ({
  initialStationId,
  initialDir,
  initialData,
}) => {
  const muiTheme = useMuiTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const { data, error, isLoading, fetchStation, reset } =
    useTrStationTimetable(initialStationId, initialData);

  const [selectedStationId, setSelectedStationId] = useState<string | null>(
    initialStationId,
  );
  const [directionFilter, setDirectionFilter] = useState<number>(
    resolveDirection(initialDir, initialData),
  );
  const [sameQueryOpen, setSameQueryOpen] = useState(false);
  // 記上次查詢的站與時間戳，用以擋「同一站太快重複查詢」
  const lastQueryRef = useRef<{ stationId: string; at: number } | null>(null);

  // 換站取得新資料後，把方向重設為該站預設（北上或第一個有車方向）；
  // ref 守住首載：SSR 帶站時不覆寫 initialDir 解析出的初值。
  const lastResolvedStation = useRef(initialStationId);
  useEffect(() => {
    if (data && data.stationId !== lastResolvedStation.current) {
      lastResolvedStation.current = data.stationId;
      setDirectionFilter(resolveDirection(null, data));
    }
  }, [data]);

  // 選站（picker 或定位）→ 重查 + 淺層更新 URL（不重跑 GSSP）；方向待新資料到位由上方 effect 重設
  const handleSelectStation = (stationId: string) => {
    // 同一站 5 秒內重複查詢 → 擋下並提示（比照 OD sameQueryMsg）
    const now = Date.now();
    const last = lastQueryRef.current;
    if (
      last &&
      last.stationId === stationId &&
      now - last.at < SAME_QUERY_INTERVAL_MS
    ) {
      setSameQueryOpen(true);
      return;
    }
    lastQueryRef.current = { stationId, at: now };

    setSelectedStationId(stationId);
    fetchStation(stationId);
    router.replace(
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
    lastQueryRef.current = null;
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
          <h1 className="text-center text-lg font-bold">
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
            />

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
                />
              )}

              {error && <NoTrainData apiError={error} isTr />}

              {!error && data && data.timeTables.length === 0 && (
                <NoTrainData isStation />
              )}
            </div>
          </div>

          {isLoading && <Loading />}

          {/* 同一站查詢太快提示（比照 OD sameQueryMsg） */}
          <CommonDialog open={sameQueryOpen} setOpen={setSameQueryOpen}>
            {t("sameQueryMsg")}
          </CommonDialog>

          {/* 底部可關閉廣告（mode=bottom，固定底部、可按 X） */}
          {AdUtils.showAd(0, 0) && showBottomAd && <AdBanner mode="bottom" />}
        </Layout>
      </MuiThemeProvider>
    </>
  );
};

export default StationTimetablePage;
