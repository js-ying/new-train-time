import usePage from "@/hooks/usePage";
import { getStationNameById } from "@/utils/StationUtils";
import { useTranslation } from "next-i18next";
import { FC, Fragment } from "react";

interface TymcStoppingStationsProps {
  stoppingStationIdList: string[];
  startStationId: string;
  endStationId: string;
}

const TymcStoppingStations: FC<TymcStoppingStationsProps> = ({
  stoppingStationIdList,
  startStationId,
  endStationId,
}) => {
  const { page } = usePage();
  const { t, i18n } = useTranslation();

  return (
    <>
      <div className="mt-6">
        <div className="border- border-y border-silverLakeBlue-500 py-2 text-center font-bold text-silverLakeBlue-500 dark:border-gamboge-500 dark:text-gamboge-500">
          {t("stoppingStation")}
        </div>
      </div>
      <div className="text-justify">
        {stoppingStationIdList.map((stationId, index) => (
          <Fragment key={stationId}>
            <span
              className={`${
                [startStationId, endStationId].includes(stationId)
                  ? "font-bold text-silverLakeBlue-500 dark:text-gamboge-500"
                  : ""
              }`}
            >
              {getStationNameById(page, stationId, i18n.language)}
            </span>
            {index < stoppingStationIdList.length - 1 && " → "}
          </Fragment>
        ))}
      </div>
    </>
  );
};

export default TymcStoppingStations;
