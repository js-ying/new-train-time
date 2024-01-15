import { useTranslation } from "next-i18next";
import { useMemo, useState } from "react";
import { TrTrainTimeTable } from "../../../types/tr-train-time-table";

/** [台鐵] 車種篩選器 */
const TrTrainTypeFilter = ({
  dataList,
  setFilterDataList,
}: {
  dataList: TrTrainTimeTable[];
  setFilterDataList: Function;
}) => {
  const { t } = useTranslation();
  const trainTypeList = useMemo(
    () => [
      "trainTypeFilterAll",
      "trainTypeFilterReserved",
      "trainTypeFilterNonReserved",
    ],
    [],
  );
  const [activeIndex, setActiveIndex] = useState(0);

  const handleFilter = (trainType, index) => {
    setActiveIndex(index);

    if (trainType === "trainTypeFilterAll") {
      setFilterDataList([...dataList]);
    } else if (trainType === "trainTypeFilterReserved") {
      setFilterDataList(
        dataList.filter((data) =>
          ["1", "2", "3", "4", "5", "11"].includes(
            data.TrainInfo.TrainTypeCode,
          ),
        ),
      );
    } else {
      setFilterDataList(
        dataList.filter((data) =>
          ["6", "7", "10"].includes(data.TrainInfo.TrainTypeCode),
        ),
      );
    }
  };

  return (
    <div className="flex">
      {trainTypeList.map((trainType, index) => (
        <button
          key={trainType}
          className={`cursor-pointer bg-neutral-500 px-3 py-1.5 dark:bg-neutral-600
              ${index === 0 ? "rounded-l" : ""}
              ${index === trainTypeList.length - 1 ? "rounded-r" : ""}
              text-center text-white ring-neutral-400/70 transition
              duration-150 ease-out hover:bg-neutral-600
              focus:ring dark:ring-neutral-300/70 dark:hover:bg-neutral-700 
              ${
                activeIndex === index
                  ? " z-10 bg-neutral-600 dark:bg-neutral-700"
                  : ""
              }`}
          onClick={() => handleFilter(trainType, index)}
        >
          {t(trainType)}
        </button>
      ))}
    </div>
  );
};

export default TrTrainTypeFilter;
