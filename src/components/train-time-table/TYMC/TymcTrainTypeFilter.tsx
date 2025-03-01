import { JsyTymcInfo } from "@/models/jsy-tymc-info";
import { isTymcTrainDirect, isTymcTrainNormal } from "@/utils/TrainInfoUtils";
import { Button, ButtonGroup } from "@heroui/react";
import { useTranslation } from "next-i18next";
import { FC, useMemo, useState } from "react";

interface TymcTrainTypeFilterProps {
  dataList: JsyTymcInfo["timeTables"];
  setFilterDataList: Function;
}

/** [桃園捷運] 車種篩選器 */
const TymcTrainTypeFilter: FC<TymcTrainTypeFilterProps> = ({
  dataList,
  setFilterDataList,
}) => {
  const { t } = useTranslation();
  const trainTypeList = useMemo(
    () => [
      "trainTypeFilterAll",
      "trainTypeFilterDirect",
      "trainTypeFilterNormal",
    ],
    [],
  );
  const [activeIndex, setActiveIndex] = useState(0);

  const handleFilter = (trainType, index) => {
    setActiveIndex(index);

    if (trainType === "trainTypeFilterAll") {
      setFilterDataList([...dataList]);
    } else if (trainType === "trainTypeFilterDirect") {
      setFilterDataList(
        dataList.filter((data) => isTymcTrainDirect(data.TrainType)),
      );
    } else {
      setFilterDataList(
        dataList.filter((data) => isTymcTrainNormal(data.TrainType)),
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
            onPress={() => handleFilter(trainType, index)}
          >
            {t(trainType)}
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
};

export default TymcTrainTypeFilter;
