import { useState } from "react";
import DateUtils from "../utils/DateUtils";

export interface ValidationResult {
  isValid: boolean;
  isDateInValid?: boolean;
}

export interface AlertOptions {
  alertMsg:
    | "bothStationAreBlankMsg"
    | "startStationIsBlankMsg"
    | "endStationIsBlankMsg"
    | "sameStationMsg"
    | "datetimeNotAllowMsg"
    | "sameQueryMsg"
    | "";
  setAlertMsg: (msg: AlertOptions["alertMsg"]) => void;
  alertOpen: boolean;
  setAlertOpen: (open: boolean) => void;
}

interface UseParamsValidationResult {
  isParamsValid: (
    startStationId: string,
    endStationId: string,
    date: string,
    time: string,
  ) => ValidationResult;
  alertOptions: AlertOptions;
}

const useParamsValidation = (): UseParamsValidationResult => {
  const [alertMsg, setAlertMsg] = useState<AlertOptions["alertMsg"]>("");
  const [alertOpen, setAlertOpen] = useState<boolean>(false);

  const isParamsValid = (
    startStationId: string,
    endStationId: string,
    date: string,
    time: string,
  ): ValidationResult => {
    if (!startStationId && !endStationId) {
      setAlertMsg("bothStationAreBlankMsg");
      setAlertOpen(true);
      return { isValid: false };
    }

    if (!startStationId) {
      setAlertMsg("startStationIsBlankMsg");
      setAlertOpen(true);
      return { isValid: false };
    }

    if (!endStationId) {
      setAlertMsg("endStationIsBlankMsg");
      setAlertOpen(true);
      return { isValid: false };
    }

    if (startStationId === endStationId) {
      setAlertMsg("sameStationMsg");
      setAlertOpen(true);
      return { isValid: false };
    }

    if (
      !date ||
      !time ||
      !DateUtils.isValid(date) ||
      DateUtils.isBefore(date, DateUtils.getCurrentDate()) ||
      DateUtils.isAfter(date, DateUtils.addMonth(DateUtils.getCurrentDate(), 2))
    ) {
      setAlertMsg("datetimeNotAllowMsg");
      setAlertOpen(true);
      return {
        isValid: false,
        isDateInValid: true,
      };
    }

    return { isValid: true };
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
