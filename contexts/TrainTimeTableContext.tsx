import { createContext, useState } from "react";
import { TrTrainTimeTable } from "../types/tr-train-time-table";

export interface TrainTimeTableData {
  dataList: TrTrainTimeTable[];
  filterDataList: TrTrainTimeTable[];
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
