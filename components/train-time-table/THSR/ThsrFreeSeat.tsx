import { useTranslation } from "next-i18next";
import { FC, useMemo } from "react";
import {
  ThsrDailyFreeSeatingCar,
  ThsrFreeSeatingCar,
} from "../../../types/thsr-train-time-table";

interface FreeSeatingCarNo {
  startCar: string;
  endCar: string;
  trainNo: string;
}

const getFreeSeatGroupListByTrainNo = (
  dataList: ThsrFreeSeatingCar[],
  trainNo: string,
): FreeSeatingCarNo[] => {
  if (dataList && dataList.length > 0) {
    const freeSeatingCar = dataList.find(
      (data) => String(data.TrainNo).padStart(4, "0") === trainNo,
    );
    if (freeSeatingCar?.CarConfig) {
      const groupList = freeSeatingCar.CarConfig.split(" ")[1].split(",");
      return groupList.map((group) => {
        return {
          startCar: group.split("-")[0].padStart(1, "0"),
          endCar: group.split("-")[1].padStart(1, "0"),
          trainNo: trainNo,
        };
      });
    }
  }

  return [];
};

interface ThsrFreeSeatProps {
  freeSeatData: ThsrDailyFreeSeatingCar;
  trainNo: string;
}

const ThsrFreeSeat: FC<ThsrFreeSeatProps> = ({ freeSeatData, trainNo }) => {
  const { t } = useTranslation();
  const freeSeatGroupList = useMemo(() => {
    return getFreeSeatGroupListByTrainNo(freeSeatData.FreeSeatingCars, trainNo);
  }, [freeSeatData, trainNo]);

  return (
    <>
      {freeSeatGroupList.length > 0 ? (
        freeSeatGroupList.map((group) => {
          return (
            <div
              className="flex items-center justify-center gap-1 text-center"
              key={`${group.trainNo}${group.startCar}-${group.endCar}`}
            >
              <span
                className="h-5 w-5 rounded-md bg-grayBlue text-sm
                leading-5 text-white transition duration-150
                ease-out dark:bg-gamboge dark:text-zinc-900"
              >
                {group.startCar}
              </span>
              -
              <span
                className="h-5 w-5 rounded-md bg-grayBlue text-sm
                leading-5 text-white transition duration-150
                ease-out dark:bg-gamboge dark:text-zinc-900"
              >
                {group.endCar}
              </span>
            </div>
          );
        })
      ) : (
        <div className="text-zinc-500 dark:text-zinc-400">
          {t("confirmOnSiteMsg")}
        </div>
      )}
    </>
  );
};

export default ThsrFreeSeat;
