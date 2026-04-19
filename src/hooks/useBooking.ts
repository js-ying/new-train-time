import { SettingContext } from "@/contexts/SettingContext";
import { GaEnum } from "@/enums/GaEnum";
import {
  JsyThsrDeeplinkDirectParams,
  JsyThsrDeeplinkWebParams,
  JsyTrDeeplinkDirectParams,
  JsyTrDeeplinkWebParams,
} from "@/models/jsy-deeplink";
import { JsyThsrTimetable } from "@/models/jsy-thsr-info";
import { JsyTrTimetable } from "@/models/jsy-tr-info";
import {
  getThsrDeeplinkDirect,
  getThsrDeeplinkWeb,
} from "@/services/thsrService";
import { getTrDeeplinkDirect, getTrDeeplinkWeb } from "@/services/trService";
import { gaClickEvent } from "@/utils/GaUtils";
import { useContext, useState } from "react";
import useDeviceDetect from "./useDeviceDetect";

const useBooking = () => {
  const { isMobile } = useDeviceDetect();
  const [loading, setLoading] = useState(false);
  const [bookingAlertOpen, setBookingAlertOpen] = useState(false);

  // 取得使用者設定的訂票方式
  const { mobileUseTrDirectBooking, mobileUseThsrDirectBooking } =
    useContext(SettingContext);

  /**
   * 統一處理導頁與 GA 埋點
   */
  const navigateToDeeplink = (
    deeplink: string,
    isUseDirect: boolean,
    type: "TR" | "THSR",
  ) => {
    // 依據車種與模式決定 GA 事件
    const gaEventMap = {
      TR: { web: GaEnum.TR_ORDER_WEB, direct: GaEnum.TR_ORDER_DIRECT },
      THSR: { web: GaEnum.THSR_ORDER_WEB, direct: GaEnum.THSR_ORDER_DIRECT },
    };

    const gaEvent = isUseDirect
      ? gaEventMap[type].direct
      : gaEventMap[type].web;
    gaClickEvent(gaEvent);

    if (isUseDirect) {
      // Direct 模式：原視窗跳轉（直接打開 APP）
      window.location.href = deeplink;
    } else {
      // Web 模式：開啟新視窗
      setTimeout(
        () => window.open(deeplink, "_blank", "noopener,noreferrer"),
        0,
      );
    }
  };

  /**
   * 台鐵訂票邏輯
   */
  const handleTrBooking = async (data: JsyTrTimetable): Promise<void> => {
    setLoading(true);

    const startStation = data.stopTimes[0].stationName.zhTw;
    const endStation =
      data.stopTimes[data.stopTimes.length - 1].stationName.zhTw;

    try {
      const isUseDirect = isMobile && mobileUseTrDirectBooking;
      let res;

      if (isUseDirect) {
        const params: JsyTrDeeplinkDirectParams = {
          startStation,
          endStation,
          trainDate: data.trainDate,
          trainNumber: Number(data.trainInfo.trainNo),
        };
        res = await getTrDeeplinkDirect(params);
      } else {
        const params: JsyTrDeeplinkWebParams = {
          startStation,
          endStation,
          departureDate: data.trainDate,
          departureNumber: data.trainInfo.trainNo,
          ticketType: 1,
          ticketCount: 1,
        };
        res = await getTrDeeplinkWeb(params);
      }

      const deeplink = res.data?.deeplink;

      if (deeplink) {
        navigateToDeeplink(deeplink, isUseDirect, "TR");
      }
    } catch (error) {
      console.error(
        `TRA ${isMobile && mobileUseTrDirectBooking ? "Direct" : "Web"} API failed:`,
        error,
      );
      setBookingAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 高鐵訂票邏輯
   */
  const handleThsrBooking = async (
    data: JsyThsrTimetable,
    carriageType: "Y" | "J" = "Y",
  ): Promise<void> => {
    setLoading(true);

    const startStationName = data.originStopTime.stationName.zhTw;
    const endStationName = data.destinationStopTime.stationName.zhTw;

    try {
      const isUseDirect = isMobile && mobileUseThsrDirectBooking;
      let res;

      if (isUseDirect) {
        const params: JsyThsrDeeplinkDirectParams = {
          startStation: startStationName,
          endStation: endStationName,
          trainDate: data.trainDate,
          trainTime: data.originStopTime.departureTime,
          trainNumber: Number(data.trainInfo.trainNo),
        };
        res = await getThsrDeeplinkDirect(params);
      } else {
        const params: JsyThsrDeeplinkWebParams = {
          ticketType: "S",
          carriageType: carriageType,
          adultTicket: 1,
          childrenTicket: 0,
          disabledTicket: 0,
          seniorTicket: 0,
          studentTicket: 0,
          startStation: startStationName,
          endStation: endStationName,
          departureDate: data.trainDate.replace(/-/g, ""), // yyyymmdd
          departureNumber: data.trainInfo.trainNo.padStart(4, "0"),
        };
        res = await getThsrDeeplinkWeb(params);
      }

      const deeplink = res.data?.deeplink;

      if (deeplink) {
        navigateToDeeplink(deeplink, isUseDirect, "THSR");
      }
    } catch (error) {
      console.error(
        `THSR ${isMobile && mobileUseThsrDirectBooking ? "Direct" : "Web"} API failed:`,
        error,
      );
      setBookingAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return {
    handleTrBooking,
    handleThsrBooking,
    loading,
    bookingAlertOpen,
    setBookingAlertOpen,
  };
};

export default useBooking;
