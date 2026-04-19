import { createContext, useState } from "react";
import { JsyTrTimetable } from "../models/jsy-tr-info";

export interface TrainTimeTableData {
  dataList: JsyTrTimetable[];
  filterDataList: JsyTrTimetable[];
}

export const TrainTimeTableContext = createContext<TrainTimeTableData>(null);
export const TrainTimeTableUpdateContext = createContext(null);

export function TrainTimeTableProvider({ children }) {
  const [trainTimeTableData, setTrainTimeTableData] = useState({
    dataList: [],
    filterDataList: [],
  });

  return (
    <TrainTimeTableContext.Provider value={trainTimeTableData}>
      <TrainTimeTableUpdateContext.Provider value={setTrainTimeTableData}>
        {children}
      </TrainTimeTableUpdateContext.Provider>
    </TrainTimeTableContext.Provider>
  );
}
