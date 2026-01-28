import { JsyTrInfo } from "@/models/jsy-tr-info";
import { getJsyTrInfo } from "@/services/trService";

import { useState } from "react";
import { AlertOptions } from "../useParamsValidation";

export const useTrSearch = (alertOptions: AlertOptions) => {
  const [jsyTrInfo, setJsyTrInfo] = useState<JsyTrInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isApiHealth, setIsApiHealth] = useState(true);

  const searchTr = async (
    startStationId: string,
    endStationId: string,
    date: string,
    time: string,
  ) => {
    setIsLoading(true);
    try {
      const data = await getJsyTrInfo(startStationId, endStationId, date, time);

      if (data?.trainTimetables?.length >= 0) {
        setJsyTrInfo(data);
      } else {
        setJsyTrInfo(null);
      }

      setIsApiHealth(true);
    } catch (error: any) {
      setJsyTrInfo(null);
      setIsApiHealth(false);
      alertOptions.setAlertMsg((error?.message || error) as any);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    jsyTrInfo,
    isLoading,
    isApiHealth,
    searchTr,
  };
};
