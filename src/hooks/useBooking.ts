import { SettingContext } from "@/contexts/SettingContext";
import { GaEnum } from "@/enums/GaEnum";
import {
  JsyTimeTable as JsyThsrTimeTable,
  ThsrDeeplinkDirectParams,
  ThsrDeeplinkWebParams,
} from "@/models/jsy-thsr-info";
import {
  JsyTrTrainTimeTable,
  TraDeeplinkDirectParams,
  TraDeeplinkWebParams,
} from "@/models/tr-train-time-table";
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
  const handleTrBooking = async (data: JsyTrTrainTimeTable): Promise<void> => {
    setLoading(true);

    const startStation = data.StopTimes[0].StationName.Zh_tw;
    const endStation =
      data.StopTimes[data.StopTimes.length - 1].StationName.Zh_tw;

    try {
      const isUseDirect = isMobile && mobileUseTrDirectBooking;
      let res;

      if (isUseDirect) {
        const params: TraDeeplinkDirectParams = {
          start_station: startStation,
          end_station: endStation,
          train_date: data.trainDate,
          train_number: Number(data.TrainInfo.TrainNo),
        };
        res = await getTrDeeplinkDirect(params);
      } else {
        const params: TraDeeplinkWebParams = {
          start_station: startStation,
          end_station: endStation,
          departure_date: data.trainDate,
          departure_number: data.TrainInfo.TrainNo,
          ticket_type: 1,
          ticket_count: 1,
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
    data: JsyThsrTimeTable,
    carriageType: "Y" | "J" = "Y",
  ): Promise<void> => {
    setLoading(true);

    const startStationName = data.OriginStopTime.StationName.Zh_tw;
    const endStationName = data.DestinationStopTime.StationName.Zh_tw;

    try {
      const isUseDirect = isMobile && mobileUseThsrDirectBooking;
      let res;

      if (isUseDirect) {
        const params: ThsrDeeplinkDirectParams = {
          start_station: startStationName,
          end_station: endStationName,
          train_date: data.TrainDate,
          train_time: data.OriginStopTime.DepartureTime,
          train_number: Number(data.DailyTrainInfo.TrainNo),
        };
        res = await getThsrDeeplinkDirect(params);
      } else {
        const params: ThsrDeeplinkWebParams = {
          ticket_type: "S",
          carriage_type: carriageType,
          adult_ticket: 1,
          children_ticket: 0,
          disabled_ticket: 0,
          senior_ticket: 0,
          student_ticket: 0,
          start_station: startStationName,
          end_station: endStationName,
          departure_date: data.TrainDate.replace(/-/g, ""), // yyyymmdd
          departure_number: data.DailyTrainInfo.TrainNo.padStart(4, "0"),
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
