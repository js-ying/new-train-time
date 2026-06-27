import { JsyBusNearestStop } from "@/models/jsy-bus-info";
import { getBusNearestStop } from "@/services/busService";
import { useTranslation } from "next-i18next";
import { useState } from "react";

/**
 * 「離我最近站牌」：geolocation 取座標 → 後端解析最近站牌 → onResolve 回呼（頁面寫 URL）。
 * 定位/查無/失敗各自的提示沿用 TR 定位錯誤 i18n + 公車專屬 key。
 */
export const useNearestBusStop = (
  onResolve: (stop: JsyBusNearestStop) => void,
) => {
  const { t } = useTranslation();
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const locate = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoError(t("trStationGeoUnsupported"));
      return;
    }
    setIsLocating(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const stop = await getBusNearestStop(
            pos.coords.latitude,
            pos.coords.longitude,
          );
          if (stop) onResolve(stop);
          else setGeoError(t("busNearestNotFound"));
        } catch {
          setGeoError(t("busNearestFailed"));
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        setIsLocating(false);
        setGeoError(t("trStationGeoDenied"));
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 },
    );
  };

  return { locate, isLocating, geoError };
};

export default useNearestBusStop;
