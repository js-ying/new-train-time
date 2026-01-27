import { JsyTymcInfo } from "@/models/jsy-tymc-info";
import { getTymcInfo } from "@/services/tymcService";
import { useState } from "react";
import { AlertOptions } from "../useParamsValidation";

export const useTymcSearch = (alertOptions: AlertOptions) => {
  const [jsyTymcInfo, setJsyTymcInfo] = useState<JsyTymcInfo>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isApiHealth, setIsApiHealth] = useState(true);

  const searchTymc = async (
    startStationId: string,
    endStationId: string,
    date: string,
    time: string,
  ) => {
    setIsLoading(true);
    try {
      const data = await getTymcInfo(startStationId, endStationId, date, time);

      if (data) {
        setJsyTymcInfo({ ...data });
      } else {
        setJsyTymcInfo({ timeTables: [] } as JsyTymcInfo);
      }
      setIsApiHealth(true);
    } catch (error: any) {
      setJsyTymcInfo({ timeTables: [] } as JsyTymcInfo);
      setIsApiHealth(false);
      alertOptions.setAlertMsg((error?.message || error) as any);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    jsyTymcInfo,
    isLoading,
    isApiHealth,
    searchTymc,
  };
};
