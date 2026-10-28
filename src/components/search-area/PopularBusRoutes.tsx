import { GaEnum } from "@/enums/GaEnum";
import { JsyPopularStation } from "@/models/jsy-popular-stations";
import { buildBusRouteTitle } from "@/utils/BusUtils";
import { gaClickEvent } from "@/utils/GaUtils";
import { useTranslation } from "next-i18next";
import { FC } from "react";
import QuickPickPills, { QuickPickItem } from "./QuickPickPills";

interface PopularBusRoutesProps {
  /** 由 /bus getServerSideProps 注入的熱門公車路線（DB 取數 + 路線索引補資訊） */
  routes?: JsyPopularStation[];
  /** 點選藥丸時通知路線頁標記為主動選擇，看板載入後才寫歷史 */
  onSelectRoute?: (routeUid: string, subRouteName?: string) => void;
}

/**
 * 公車頁的「熱門路線快速查詢」。藥丸顯示「縣市 / 分類 + 路線名」，連 /bus?routeUid=X(&sub=Y)。
 */
const PopularBusRoutes: FC<PopularBusRoutesProps> = ({
  routes,
  onSelectRoute,
}) => {
  const { t, i18n } = useTranslation();

  // 防 SSR 水合不匹配（比照 PopularRoutes）
  if (!i18n || !i18n.language) return null;

  const items: QuickPickItem[] = (routes ?? []).flatMap((r) => {
    if (!r.busRoute) return [];
    const { routeUid, subRouteName } = r.busRoute;
    const { label, titleText } = buildBusRouteTitle(
      t,
      i18n.language,
      r.busRoute,
    );
    return {
      key: r.stationId,
      label,
      // 只帶 routeUid + 子線
      href: {
        pathname: "/bus",
        query: subRouteName ? { routeUid, sub: subRouteName } : { routeUid },
      },
      onClick: () => {
        gaClickEvent(GaEnum.BUS_POPULAR_ROUTE);
        onSelectRoute?.(routeUid, subRouteName);
      },
      title: titleText,
    };
  });

  return <QuickPickPills title={t("popularRoutes")} items={items} />;
};

export default PopularBusRoutes;
