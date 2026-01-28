import CommonDialog from "@/components/common/CommonDialog";
import useBooking from "@/hooks/useBooking";
import { ThsrDailyTimetable } from "@/models/jsy-thsr-info";

import DateUtils from "@/utils/DateUtils";
import { isTrainPass } from "@/utils/TrainInfoUtils";
import { Button } from "@heroui/react";
import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import { isOnlyBusinessAvailable } from "./ThsrAvailableSeatStatus";

/**
 * 是否顯示 [高鐵] 訂票按鈕
 */
export const isShowThsrOrderBtn = (timeTable: ThsrDailyTimetable) => {
  // 列車已發車不顯示訂票按鈕
  if (
    isTrainPass(
      timeTable.TrainDate,
      DateUtils.getCurrentDate(),
      timeTable.OriginStopTime.DepartureTime,
    )
  ) {
    return false;
  }

  // 30 分鐘內發車之列車不顯示訂票按鈕
  if (
    DateUtils.isWithinMinutes(
      DateUtils.getCurrentDatetime(),
      `${timeTable.TrainDate} ${timeTable.OriginStopTime.DepartureTime}:00`,
      30,
    )
  ) {
    return false;
  }

  return true;
};

interface ThsrOrderButtonProps {
  timeTable: ThsrDailyTimetable;
}

const ThsrOrderButton: React.FC<ThsrOrderButtonProps> = ({ timeTable }) => {
  const { t } = useTranslation();
  const { handleThsrBooking, loading, bookingAlertOpen, setBookingAlertOpen } =
    useBooking();
  const [showConfirm, setShowConfirm] = useState(false);

  const handlePress = () => {
    // 若僅剩商務車廂，則顯示提醒彈窗
    if (isOnlyBusinessAvailable(timeTable)) {
      setShowConfirm(true);
    } else {
      handleThsrBooking(timeTable);
    }
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Button
        size="sm"
        className="h-6 min-w-fit bg-neutral-500 p-2 text-sm text-white dark:bg-neutral-600"
        onPress={handlePress}
        isLoading={loading}
      >
        {t("order")}
      </Button>

      {/* 商務車廂訂票提醒 */}
      <CommonDialog
        open={showConfirm}
        setOpen={setShowConfirm}
        title="reminderAlertTitle"
        confirmText="confirm"
        cancelText="cancel"
        onConfirm={() => handleThsrBooking(timeTable, "J")}
      >
        {t("businessSeatAlertMsg")}
      </CommonDialog>

      <CommonDialog open={bookingAlertOpen} setOpen={setBookingAlertOpen}>
        {t("orderFailMsg")}
      </CommonDialog>
    </div>
  );
};

export default ThsrOrderButton;
