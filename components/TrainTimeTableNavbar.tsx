import { useTranslation } from "next-i18next";
import { useMemo, useState } from "react";
import { PageEnum } from "../enums/Page";

/** 高鐵票價資訊 */
const ThsrPriceInfo = () => {
  return <>ThsrTickedPrice</>;
};

/** 台鐵車種篩選器 */
const TrTrainTypeFilter = () => {
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

  return (
    <div className="flex">
      {trainTypeList.map((trainType, index) => (
        <div
          key={trainType}
          className={`cursor-pointer bg-neutral-500 px-3 py-1.5
            ${index === 0 ? "rounded-l" : ""}
            ${index === trainTypeList.length - 1 ? "rounded-r" : ""}
            text-center text-white transition
            duration-150 ease-out hover:bg-neutral-600 dark:bg-neutral-600 hover:dark:bg-neutral-700
            ${
              activeIndex === index ? "bg-neutral-600 dark:bg-neutral-700" : ""
            }`}
          onClick={() => setActiveIndex(index)}
        >
          {t(trainType)}
        </div>
      ))}
    </div>
  );
};

/** 時刻表長度計算器 */
const TableLengthCounter = ({ count }: { count: number }) => {
  return <div className="">共 {count} 筆</div>;
};

/** 列車時刻表上方資訊 */
const TrainTimeTableNavbar = ({
  page,
  dataList,
}: {
  page: PageEnum;
  dataList: any[];
}) => {
  const isTr = page === PageEnum.TR;
  const isThsr = page === PageEnum.THSR;

  return (
    <div className="flex items-center justify-between text-sm">
      {isTr && <TrTrainTypeFilter />}

      {isThsr && <ThsrPriceInfo />}

      <TableLengthCounter count={dataList.length} />
    </div>
  );
};

export default TrainTimeTableNavbar;
