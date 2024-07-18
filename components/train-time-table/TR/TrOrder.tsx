import { Button } from "@nextui-org/react";
import { useTranslation } from "next-i18next";
import { FC } from "react";
import { JsyTrTrainTimeTable } from "../../../types/tr-train-time-table";
import DateUtils from "../../../utils/DateUtils";
import { isTrTrainReserved, isTrainPass } from "../../../utils/TrainInfoUtils";

/**
 * 是否顯示 [台鐵] 訂票按鈕
 */
export const isShowTrOrderBtn = (data: JsyTrTrainTimeTable) => {
  // 非對號列車不顯示訂票按鈕
  if (!isTrTrainReserved(data.TrainInfo.TrainTypeCode)) {
    return false;
  }

  // 列車已發車不顯示訂票按鈕
  if (
    isTrainPass(
      data.trainDate,
      DateUtils.getCurrentDate(),
      data.StopTimes[0].DepartureTime,
    )
  ) {
    return false;
  }

  // 30 分鐘內發車之列車不顯示訂票按鈕
  if (
    DateUtils.isWithinMinutes(
      DateUtils.getCurrentDatetime(),
      `${data.trainDate} ${data.StopTimes[0].DepartureTime}:00`,
      30,
    )
  ) {
    return false;
  }

  return true;
};

interface TrOrderProps {
  data: JsyTrTrainTimeTable;
}

/**
 * 台鐵訂票
 */
const TrOrder: FC<TrOrderProps> = ({ data }) => {
  const { t } = useTranslation();

  return (
    <form
      action="https://tip.railway.gov.tw/tra-tip-web/tip/tip001/tip117/tra2traUrl"
      method="post"
      target="_blank"
    >
      <input
        type="hidden"
        name="queryDate"
        value={DateUtils.dateFormatter(data.trainDate, "YYYY/MM/DD")}
      />
      <input
        type="hidden"
        name="transferList[0].startStation.stationCode"
        value={data.StopTimes[0].StationID}
      />
      <input
        type="hidden"
        name="transferList[0].endStation.stationCode"
        value={data.StopTimes[data.StopTimes.length - 1].StationID}
      />
      <input
        type="hidden"
        name="departureTime"
        value={`${data.trainDate} ${data.StopTimes[0].DepartureTime}:00.0`}
      />
      <input
        type="hidden"
        name="transferList[0].trainType.code"
        value={data.TrainInfo.TrainTypeCode}
      />
      <input
        type="hidden"
        name="transferList[0].trainType.isReserve"
        value="true"
      />
      <input
        type="hidden"
        name="transferList[0].trainNo"
        value={data.TrainInfo.TrainNo}
      />
      <input type="hidden" name="isRealName" value="false" />
      <input type="hidden" name="realNameTktPkg" value="" />
      <input type="hidden" name="goToBookingPage" value="NORMAL" />
      <Button
        type="submit"
        className="h-6 min-w-fit bg-neutral-500 text-sm text-white dark:bg-neutral-600"
        size="sm"
        radius="sm"
      >
        {t("order")}
      </Button>
    </form>
  );
};

export default TrOrder;
