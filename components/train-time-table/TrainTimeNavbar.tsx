import { useTranslation } from "next-i18next";
import { PageEnum } from "../../enums/Page";
import { JsyThsrTrainTimeTable } from "../../types/thsr-train-time-table";
import { JsyTrTrainTimeTable } from "../../types/tr-train-time-table";
import ThsrPriceInfo from "./THSR/ThsrPriceInfo";
import TrTrainTypeFilter from "./TR/TrTrainTypeFilter";

/** 時刻表長度計算 */
const TableLengthCount = ({
  page,
  totalCount,
  filterCount,
}: {
  page: PageEnum;
  totalCount: number;
  filterCount: number;
}) => {
  const { t } = useTranslation();
  const isTr = page === PageEnum.TR;
  const isThsr = page === PageEnum.THSR;

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

/** 列車時刻導覽列 */
const TrainTimeNavbar = ({
  page,
  trTrainTimeTable,
  filterTrTrainTimeTable,
  setFilterTrTrainTimeTable,
  thsrTrainTimeTable,
}: {
  page: PageEnum;
  trTrainTimeTable: JsyTrTrainTimeTable[];
  filterTrTrainTimeTable: JsyTrTrainTimeTable[];
  setFilterTrTrainTimeTable: Function;
  thsrTrainTimeTable: JsyThsrTrainTimeTable;
}) => {
  const isTr = page === PageEnum.TR;
  const isThsr = page === PageEnum.THSR;

  return (
    <div className="flex items-center justify-between text-sm">
      {isTr && (
        <TrTrainTypeFilter
          dataList={trTrainTimeTable}
          setFilterDataList={setFilterTrTrainTimeTable}
        />
      )}

      {isThsr && <ThsrPriceInfo dataList={thsrTrainTimeTable.fareList} />}

      <TableLengthCount
        page={page}
        totalCount={
          trTrainTimeTable?.length || thsrTrainTimeTable?.timeTable?.length
        }
        filterCount={filterTrTrainTimeTable?.length || null}
      />
    </div>
  );
};

export default TrainTimeNavbar;
