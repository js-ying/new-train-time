import usePage from "@/hooks/usePage";
import useSearchAreaParams from "@/hooks/useSearchAreaParams";
import { getStationNameById } from "@/utils/StationUtils";
import { useTranslation } from "next-i18next";
import { FC } from "react";

/**
 * TrainTrip JSON-LD（schema.org/TrainTrip）：宣告搜尋結果頁的列車行程。
 *
 * 僅在搜尋頁面（含起訖站參數）下渲染；以 useSearchAreaParams 取得起訖站 ID 後對應到
 * 站名 i18n 字串。providers 對應該交通工具的營運單位（台鐵、高鐵、桃園捷運）。
 */
const TrainTripJsonLd: FC = () => {
  const { t, i18n } = useTranslation();
  const { page, isThsr, isTymc } = usePage();
  const { urlSearchAreaParams } = useSearchAreaParams();
  const { startStationId, endStationId } = urlSearchAreaParams;

  if (!startStationId || !endStationId) return null;

  const startStationName = getStationNameById(
    page,
    startStationId,
    i18n.language,
  );
  const endStationName = getStationNameById(page, endStationId, i18n.language);

  if (!startStationName || !endStationName) return null;

  // 各交通工具的營運單位（schema.org Organization）
  const providerName = isThsr
    ? "Taiwan High Speed Rail Corporation"
    : isTymc
      ? "Taoyuan Metro Corporation"
      : "Taiwan Railway Administration";

  const schema = {
    "@context": "https://schema.org",
    "@type": "TrainTrip",
    name: t("stationToStationTimeTableTitle", {
      startStation: startStationName,
      endStation: endStationName,
    }),
    departureStation: {
      "@type": "TrainStation",
      name: startStationName,
    },
    arrivalStation: {
      "@type": "TrainStation",
      name: endStationName,
    },
    provider: {
      "@type": "Organization",
      name: providerName,
    },
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default TrainTripJsonLd;
