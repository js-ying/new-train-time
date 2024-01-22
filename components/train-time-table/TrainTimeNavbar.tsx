import { useTranslation } from "next-i18next";
import { PageEnum } from "../../enums/Page";
import { JsyTrTrainTimeTable } from "../../types/tr-train-time-table";
import ThsrPriceInfo from "./THSR/ThsrTickedPrice";
import TrTrainTypeFilter from "./TR/TrTrainTypeFilter";

/** 時刻表長度計算 */
const TableLengthCount = ({
  dataList,
  filterDataList,
}: {
  dataList: JsyTrTrainTimeTable[];
  filterDataList: JsyTrTrainTimeTable[];
}) => {
  const { t } = useTranslation();

  return (
    <div className="">
      {t("trainTableLengthCount", {
        filter: filterDataList.length,
        total: dataList.length,
      })}
    </div>
  );
};

/** 列車時刻導覽列 */
const TrainTimeNavbar = ({
  page,
  dataList,
  filterDataList,
  setFilterDataList,
}: {
  page: PageEnum;
  dataList: JsyTrTrainTimeTable[];
  filterDataList: JsyTrTrainTimeTable[];
  setFilterDataList: Function;
}) => {
  const isTr = page === PageEnum.TR;
  const isThsr = page === PageEnum.THSR;

  return (
    <div className="flex items-center justify-between text-sm">
      {isTr && (
        <TrTrainTypeFilter
          dataList={dataList}
          setFilterDataList={setFilterDataList}
        />
      )}

      {isThsr && <ThsrPriceInfo />}

      <TableLengthCount dataList={dataList} filterDataList={filterDataList} />
    </div>
  );
};

export default TrainTimeNavbar;
