import {
  JsyTrTrainTimeTable,
  TraDeeplinkDirectParams,
  TraDeeplinkWebParams,
} from "@/models/tr-train-time-table";
import fetchData from "@/services/fetchData";
import { useState } from "react";
import useDeviceDetect from "./useDeviceDetectHook";

const useBooking = () => {
  const { isMobile } = useDeviceDetect();
  const [loading, setLoading] = useState(false);
  const [bookingAlertOpen, setBookingAlertOpen] = useState(false);

  /**
   * 台鐵訂票邏輯
   */
  const handleTrBooking = async (data: JsyTrTrainTimeTable): Promise<void> => {
    setLoading(true);

    const startStation = data.StopTimes[0].StationName.Zh_tw;
    const endStation =
      data.StopTimes[data.StopTimes.length - 1].StationName.Zh_tw;

    try {
      const endpoint = isMobile
        ? "/api/getTraDeeplinkDirect"
        : "/api/getTraDeeplinkWeb";

      const params = isMobile
        ? ({
            start_station: startStation,
            end_station: endStation,
            train_date: data.trainDate,
            train_number: Number(data.TrainInfo.TrainNo),
          } as TraDeeplinkDirectParams)
        : ({
            start_station: startStation,
            end_station: endStation,
            departure_date: data.trainDate,
            departure_number: data.TrainInfo.TrainNo,
            ticket_type: 1,
            ticket_count: 1,
          } as TraDeeplinkWebParams);

      const res = await fetchData(endpoint, params);
      const deeplink = res.data?.deeplink;

      if (deeplink) {
        if (isMobile) {
          window.location.href = deeplink;
        } else {
          window.open(deeplink, "_blank");
        }
      }
    } catch (error) {
      console.error(`TRA ${isMobile ? "Direct" : "Web"} API failed:`, error);
      setBookingAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 高鐵訂票邏輯 (待實作)
   */
  const handleThsrBooking = async (): Promise<void> => {
    // TODO: Implement THSR booking logic
    console.log("THSR booking not implemented yet");
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
