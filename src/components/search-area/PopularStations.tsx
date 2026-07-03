import { GaEnum } from "@/enums/GaEnum";
import useStationHistory from "@/hooks/useStationHistory";
import { JsyPopularStation } from "@/models/jsy-popular-stations";
import { gaClickEvent } from "@/utils/GaUtils";
import { getTrStationNameById } from "@/utils/StationUtils";
import { useTranslation } from "next-i18next";
import { FC } from "react";
import QuickPickPills, { QuickPickItem } from "./QuickPickPills";

interface PopularStationsProps {
  /** 由 /station getServerSideProps 注入的 TR 熱門車站（DB 取數，失敗為 fallback） */
  stations?: JsyPopularStation[];
}

/**
 * 台鐵單站頁的「熱門車站快速查詢」（裸 hub 頁內容）。連 /station?station=X（預設北上），
 * SSR 即渲染為可爬內部連結，把權重導向各站別時刻表頁。未來公車單站/單路線可比照新增。
 */
const PopularStations: FC<PopularStationsProps> = ({ stations }) => {
  const { t, i18n } = useTranslation();
  const { saveHistory } = useStationHistory("TR");

  // 防 SSR 水合不匹配（比照 PopularRoutes）
  if (!i18n || !i18n.language) return null;

  const items: QuickPickItem[] = (stations ?? []).map((s) => {
    // 顯示名走 i18n（zh/en 即時解析）；解析不出才退回 DB 站名或站號
    const name =
      getTrStationNameById(s.stationId, i18n.language) ||
      s.stationName ||
      s.stationId;
    return {
      key: s.stationId,
      label: name,
      href: { pathname: "/station", query: { station: s.stationId } },
      // 送 GA + 存單站歷史（對齊 OD 熱門路線）；不 preventDefault，Link 照常導頁、爬蟲仍跟隨 href
      onClick: () => {
        gaClickEvent(GaEnum.TR_POPULAR_STATION);
        saveHistory({ targetId: s.stationId, targetName: name });
      },
      title: t("trStationBoardStationSeoTitle", { station: name }),
    };
  });

  return (
    <QuickPickPills title={t("popularStations")} items={items} mobileGrid3 />
  );
};

export default PopularStations;
