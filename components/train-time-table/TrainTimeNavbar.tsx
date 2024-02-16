import { useTranslation } from "next-i18next";
import { FC } from "react";
import usePage from "../../hooks/usePageHook";
import { JsyThsrTrainTimeTable } from "../../types/thsr-train-time-table";
import { JsyTrTrainTimeTable } from "../../types/tr-train-time-table";
import ThsrPriceInfo from "./THSR/ThsrPriceInfo";
import TrTrainTypeFilter from "./TR/TrTrainTypeFilter";

interface TableLengthCountProps {
  totalCount: number;
  filterCount: number;
}

/** 時刻表長度計算 */
const TableLengthCount: FC<TableLengthCountProps> = ({
  totalCount,
  filterCount,
}) => {
  const { t } = useTranslation();
  const { isTr, isThsr } = usePage();

  return (
    <div className="">
      {isTr && (
        <span className="whitespace-nowrap">
          {t("trainTableLengthCount", {
            filter: filterCount,
            total: totalCount,
          })}
        </span>
      )}

      {isThsr && (
        <span className="whitespace-nowrap">
          {t("thsrTrainTableLengthCount", {
            total: totalCount,
          })}
        </span>
      )}
    </div>
  );
};

interface TrainTimeNavbarProps {
  trTrainTimeTable: JsyTrTrainTimeTable[];
  filterTrTrainTimeTable: JsyTrTrainTimeTable[];
  setFilterTrTrainTimeTable: Function;
  thsrTrainTimeTable: JsyThsrTrainTimeTable;
}

/** 列車時刻導覽列 */
const TrainTimeNavbar: FC<TrainTimeNavbarProps> = ({
  trTrainTimeTable,
  filterTrTrainTimeTable,
  setFilterTrTrainTimeTable,
  thsrTrainTimeTable,
}) => {
  const { isTr, isThsr } = usePage();

  return (
    <div className="flex items-center justify-between text-sm">
      {isTr && (
        <TrTrainTypeFilter
          dataList={trTrainTimeTable}
          setFilterDataList={setFilterTrTrainTimeTable}
        />
      )}

      {isThsr && (
        <ThsrPriceInfo dataList={thsrTrainTimeTable.fareList} showAll={false} />
      )}

      <TableLengthCount
        totalCount={
          trTrainTimeTable?.length || thsrTrainTimeTable?.timeTable?.length
        }
        filterCount={filterTrTrainTimeTable?.length || null}
      />
    </div>
  );
};

export default TrainTimeNavbar;
