import { JsyThsrInfo } from "@/models/jsy-thsr-info";
import { getThsrInfo } from "@/services/thsrService";
import { useState } from "react";
import { AlertOptions } from "../useParamsValidation";

export const useThsrSearch = (alertOptions: AlertOptions) => {
  const [jsyThsrInfo, setJsyThsrInfo] = useState<JsyThsrInfo>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isApiHealth, setIsApiHealth] = useState(true);

  const searchThsr = async (
    startStationId: string,
    endStationId: string,
    date: string,
    time: string,
  ) => {
    setIsLoading(true);
    try {
      const data = await getThsrInfo(startStationId, endStationId, date, time);

      if (data) {
        setJsyThsrInfo({ ...data });
      } else {
        setJsyThsrInfo((prev) => (prev ? { ...prev, timeTable: [] } : null));
      }
      setIsApiHealth(true);
    } catch (error: any) {
      setJsyThsrInfo((prev) => (prev ? { ...prev, timeTable: [] } : null));
      setIsApiHealth(false);
      alertOptions.setAlertMsg(error?.message || error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    jsyThsrInfo,
    isLoading,
    isApiHealth,
    searchThsr,
  };
};
