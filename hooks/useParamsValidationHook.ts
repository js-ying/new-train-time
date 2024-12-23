import { useState } from "react";
import DateUtils from "../utils/DateUtils";

export interface AlertOptions {
  alertMsg: string;
  setAlertMsg: (msg: string) => void;
  alertOpen: boolean;
  setAlertOpen: (open: boolean) => void;
}

interface UseParamsValidationResult {
  isParamsValid: (
    startStationId: string,
    endStationId: string,
    date: string,
    time: string,
  ) => boolean;
  alertOptions: AlertOptions;
}

const useParamsValidation = (): UseParamsValidationResult => {
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertOpen, setAlertOpen] = useState<boolean>(false);

  const isParamsValid = (
    startStationId: string,
    endStationId: string,
    date: string,
    time: string,
  ): boolean => {
    if (!startStationId && !endStationId) {
      setAlertMsg("bothStationAreBlankMsg");
      setAlertOpen(true);
      return false;
    }

    if (!startStationId) {
      setAlertMsg("startStationIsBlankMsg");
      setAlertOpen(true);
      return false;
    }

    if (!endStationId) {
      setAlertMsg("endStationIsBlankMsg");
      setAlertOpen(true);
      return false;
    }

    if (startStationId === endStationId) {
      setAlertMsg("sameStationMsg");
      setAlertOpen(true);
      return false;
    }

    if (
      DateUtils.isBefore(date, DateUtils.getCurrentDate()) ||
      DateUtils.isAfter(date, DateUtils.addMonth(DateUtils.getCurrentDate(), 2))
    ) {
      setAlertMsg("datetimeNotAllowMsg");
      setAlertOpen(true);
      return false;
    }

    if (!date || !time) {
      setAlertMsg("paramsErrorMsg");
      setAlertOpen(true);
      return false;
    }

    return true;
  };

  const alertOptions = {
    alertMsg,
    setAlertMsg,
    alertOpen,
    setAlertOpen,
  };

  return {
    isParamsValid,
    alertOptions,
  };
};

export default useParamsValidation;
