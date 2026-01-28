import { JsyAnnouncement } from "@/models/jsy-announcement";
import { JsyTrTrainTimeTable } from "@/models/tr-train-time-table";
import { getTrTrainTimeTable } from "@/services/trService";
import { useState } from "react";
import { AlertOptions } from "../useParamsValidation";

export const useTrSearch = (alertOptions: AlertOptions) => {
  const [trainTimeTable, setTrainTimeTable] =
    useState<JsyTrTrainTimeTable[]>(null);
  const [announcements, setAnnouncements] = useState<JsyAnnouncement[]>([]);
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
      const data = await getTrTrainTimeTable(
        startStationId,
        endStationId,
        date,
        time,
      );

      if (data?.TrainTimetables?.length >= 0) {
        const jsyTrTrainTimeTables: JsyTrTrainTimeTable[] = [
          ...data.TrainTimetables,
        ];
        jsyTrTrainTimeTables.forEach(
          (table: JsyTrTrainTimeTable) => (table["trainDate"] = data.TrainDate),
        );
        setTrainTimeTable(jsyTrTrainTimeTables);
        setAnnouncements(data.announcements || []);
      } else {
        setTrainTimeTable([]);
        setAnnouncements([]);
      }

      setIsApiHealth(true);
    } catch (error: any) {
      setTrainTimeTable([]);
      setIsApiHealth(false);
      alertOptions.setAlertMsg((error?.message || error) as any);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    trainTimeTable,
    announcements,
    isLoading,
    isApiHealth,
    searchTr,
  };
};
