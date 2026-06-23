import AdBanner from "@/components/common/AdBanner";
import { JsyTrStationTimetable } from "@/models/jsy-tr-info";
import AdUtils from "@/utils/AdUtils";
import DateUtils from "@/utils/DateUtils";
import {
  isTrainPass,
  isTrTrainNonReserved,
  isTrTrainReserved,
} from "@/utils/TrainInfoUtils";
import { Button, ButtonGroup } from "@heroui/react";
import { useTranslation } from "next-i18next";
import { FC, useMemo, useState } from "react";
import TrainTimeNavbar from "../../TrainTimeNavbar";
import NoTrainData from "../../NoTrainData";
import TrStationDirectionFilter from "./TrStationDirectionFilter";
import TrStationTimeInfo from "./TrStationTimeInfo";

type TypeFilter = "all" | "reserved" | "nonReserved";

interface TrStationTimeTableProps {
  data: JsyTrStationTimetable;
  /** 方向篩選由頁面持有（同步進 URL） */
  directionFilter: number;
  onDirectionChange: (value: number) => void;
}

/** [台鐵] 單站時刻表：方向 + 對號/非對號雙篩選（皆前端），不顯示已過站班次、無票價 */
const TrStationTimeTable: FC<TrStationTimeTableProps> = ({
  data,
  directionFilter,
  onDirectionChange,
}) => {
  const { t } = useTranslation();
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

  // 先濾掉已發車（已過站）班次，再依方向/車種篩選；筆數以未過站為母數
  const upcoming = useMemo(
    () =>
      data.timeTables.filter(
        (trn) =>
          !isTrainPass(
            data.trainDate,
            DateUtils.getCurrentDate(),
            trn.stopTime.departureTime,
          ),
      ),
    [data.timeTables, data.trainDate],
  );

  const filtered = useMemo(
    () =>
      upcoming.filter((trn) => {
        const dirOk = trn.trainInfo.direction === directionFilter;
        const typeOk =
          typeFilter === "all" ||
          (typeFilter === "reserved"
            ? isTrTrainReserved(trn.trainInfo.trainTypeCode)
            : isTrTrainNonReserved(trn.trainInfo.trainTypeCode));
        return dirOk && typeOk;
      }),
    [upcoming, directionFilter, typeFilter],
  );

  const typeOptions: { key: TypeFilter; label: string }[] = [
    { key: "all", label: t("trainTypeFilterAll") },
    { key: "reserved", label: t("trainTypeFilterReserved") },
    { key: "nonReserved", label: t("trainTypeFilterNonReserved") },
  ];

  return (
    <>
      <div className="mb-4 flex flex-col gap-3">
        {/* 方向篩選（北上/南下 或 往X，置中） */}
        <div className="mb-2">
          <TrStationDirectionFilter
            directions={data.directions}
            value={directionFilter}
            onChange={onDirectionChange}
          />
        </div>

        {/* 對號 / 非對號 + 筆數 */}
        <TrainTimeNavbar
          totalCount={upcoming.length}
          filterCount={filtered.length}
        >
          <div className="flex">
            <ButtonGroup radius="sm">
              {typeOptions.map((opt) => (
                <Button
                  key={opt.key}
                  className={`h-8 min-w-fit bg-secondary px-3 text-sm text-secondary-foreground/70 ${
                    typeFilter === opt.key
                      ? "font-bold text-secondary-foreground"
                      : ""
                  }`}
                  onPress={() => setTypeFilter(opt.key)}
                >
                  {opt.label}
                </Button>
              ))}
            </ButtonGroup>
          </div>
        </TrainTimeNavbar>
      </div>

      {/* 當前方向（+車種）無未過站班次 → 顯示 noData；方向/車種篩選仍保留於上方供切換 */}
      {filtered.length > 0 ? (
        <div className="flex flex-col gap-4">
          {filtered.map((trn, index) => (
            <div key={trn.trainInfo.trainNo}>
              <TrStationTimeInfo data={trn} trainDate={data.trainDate} />
              {/* 最多第三筆後插廣告，不足三筆依序遞減（同 OD） */}
              {AdUtils.showAd(filtered.length, index) && (
                <div className="mt-4 empty:hidden">
                  <AdBanner />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <>
          <NoTrainData isStation />
          {AdUtils.showAd(0, 0) && (
            <div className="mt-4 empty:hidden">
              <AdBanner />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default TrStationTimeTable;
