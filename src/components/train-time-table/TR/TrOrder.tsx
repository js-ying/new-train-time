import CommonDialog from "@/components/common/CommonDialog";
import { Button } from "@heroui/react";
import { useTranslation } from "next-i18next";
import { FC } from "react";
import useBooking from "../../../hooks/useBooking";
import { TrDailyTrainTimetable } from "../../../models/jsy-tr-info";

import DateUtils from "../../../utils/DateUtils";
import { isTrainPass, isTrTrainReserved } from "../../../utils/TrainInfoUtils";

/**
 * 是否顯示 [台鐵] 訂票按鈕
 */
export const isShowTrOrderBtn = (data: TrDailyTrainTimetable) => {
  // 非對號列車不顯示訂票按鈕
  if (!isTrTrainReserved(data.TrainInfo.TrainTypeCode)) {
    return false;
  }

  // 列車已發車不顯示訂票按鈕
  if (
    isTrainPass(
      data.jsyTrainDate,
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
      `${data.jsyTrainDate} ${data.StopTimes[0].DepartureTime}:00`,
      30,
    )
  ) {
    return false;
  }

  return true;
};

interface TrOrderProps {
  data: TrDailyTrainTimetable;
}

/**
 * 台鐵訂票 (TDX Deeplink 實作)
 */
const TrOrder: FC<TrOrderProps> = ({ data }) => {
  const { t } = useTranslation();
  const { handleTrBooking, loading, bookingAlertOpen, setBookingAlertOpen } =
    useBooking();

  const handleOrder = async () => {
    await handleTrBooking(data);
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Button
        className="h-6 min-w-fit bg-neutral-500 text-sm text-white dark:bg-neutral-600"
        size="sm"
        radius="sm"
        onPress={handleOrder}
        isLoading={loading}
      >
        {t("order")}
      </Button>

      <CommonDialog open={bookingAlertOpen} setOpen={setBookingAlertOpen}>
        {t("orderFailMsg")}
      </CommonDialog>
    </div>
  );
};

export default TrOrder;
