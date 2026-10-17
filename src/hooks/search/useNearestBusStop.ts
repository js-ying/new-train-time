import { JsyBusNearestStop } from "@/models/jsy-bus-info";
import { getBusNearestStop } from "@/services/busService";
import { useTranslation } from "next-i18next";
import { useState } from "react";

/**
 * 「離我最近站牌」：geolocation 取座標 → 後端解析最近站牌 → onResolve 回呼（頁面寫 URL）。
 * 定位/失敗為錯誤（geoError）；附近查無站牌另以 notFound 回報，由頁面以無資料提示呈現。
 */
export const useNearestBusStop = (
  onResolve: (stop: JsyBusNearestStop) => void,
) => {
  const { t } = useTranslation();
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const locate = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoError(t("trStationGeoUnsupported"));
      return;
    }
    setIsLocating(true);
    setGeoError(null);
    setNotFound(false);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const stop = await getBusNearestStop(
            pos.coords.latitude,
            pos.coords.longitude,
          );
          if (stop) onResolve(stop);
          else setNotFound(true);
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
      // 高精度 GPS：粗略定位誤差大、站牌間易抖（最近站牌翻來翻去）；maximumAge 容許重用近 60s 定位增加穩定
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  };

  return { locate, isLocating, geoError, notFound };
};

export default useNearestBusStop;
