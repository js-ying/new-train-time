import { Button, ButtonGroup } from "@heroui/react";
import { useTranslation } from "next-i18next";
import { FC, useMemo, useState } from "react";
import { JsyTrTrainTimeTable } from "../../../types/tr-train-time-table";
import {
  isTrTrainNonReserved,
  isTrTrainReserved,
} from "../../../utils/TrainInfoUtils";

interface TrTrainTypeFilterProps {
  dataList: JsyTrTrainTimeTable[];
  setFilterDataList: Function;
}

/** [台鐵] 車種篩選器 */
const TrTrainTypeFilter: FC<TrTrainTypeFilterProps> = ({
  dataList,
  setFilterDataList,
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
          isTrTrainReserved(data.TrainInfo.TrainTypeCode),
        ),
      );
    } else {
      setFilterDataList(
        dataList.filter((data) =>
          isTrTrainNonReserved(data.TrainInfo.TrainTypeCode),
        ),
      );
    }
  };

  return (
    <div className="flex">
      <ButtonGroup radius="sm">
        {trainTypeList.map((trainType, index) => (
          <Button
            key={trainType}
            className={`h-8 min-w-fit bg-neutral-500 px-3 text-sm text-zinc-300 dark:text-zinc-400 ${
              activeIndex === index
                ? "font-bold text-white dark:text-white"
                : ""
            } dark:bg-neutral-600`}
            onClick={() => handleFilter(trainType, index)}
          >
            {t(trainType)}
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
};

export default TrTrainTypeFilter;
