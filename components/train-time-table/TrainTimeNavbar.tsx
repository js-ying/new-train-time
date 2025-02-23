import { useTranslation } from "next-i18next";
import { FC } from "react";
import usePage from "../../hooks/usePageHook";

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
  const { isTr, isThsr, isTymc } = usePage();

  return (
    <div className="text-sm">
      {(isTr || isTymc) && (
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
  totalCount: number;
  filterCount: number;
  children: React.ReactNode;
}

/** 列車時刻導覽列 */
const TrainTimeNavbar: FC<TrainTimeNavbarProps> = ({
  totalCount,
  filterCount,
  children,
}) => {
  return (
    <div className="flex items-center justify-between">
      {children}
      <TableLengthCount totalCount={totalCount} filterCount={filterCount} />
    </div>
  );
};

export default TrainTimeNavbar;
