import { useState } from "react";
import DateUtils from "../utils/DateUtils";
import usePage from "./usePage";

export interface ValidationResult {
  isValid: boolean;
  isDateInValid?: boolean;
}

/**
 * 參數驗證 alert（缺站、同站、日期超範圍等）的對外控制契約。
 * 與 API 錯誤無關——API 錯誤走 apiError + DataState，那條通道請見 useApiError。
 */
export interface ValidationAlert {
  message:
    | "bothStationAreBlankMsg"
    | "startStationIsBlankMsg"
    | "endStationIsBlankMsg"
    | "sameStationMsg"
    | "datetimeNotAllowMsg"
    | "sameQueryMsg"
    | "";
  setMessage: (msg: ValidationAlert["message"]) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface UseParamsValidationResult {
  isParamsValid: (
    startStationId: string,
    endStationId: string,
    date: string,
    time: string,
  ) => ValidationResult;
  validationAlert: ValidationAlert;
}

const useParamsValidation = (): UseParamsValidationResult => {
  const [message, setMessage] = useState<ValidationAlert["message"]>("");
  const [open, setOpen] = useState<boolean>(false);
  const { page } = usePage();

  const isParamsValid = (
    startStationId: string,
    endStationId: string,
    date: string,
    time: string,
  ): ValidationResult => {
    if (!startStationId && !endStationId) {
      setMessage("bothStationAreBlankMsg");
      setOpen(true);
      return { isValid: false };
    }

    if (!startStationId) {
      setMessage("startStationIsBlankMsg");
      setOpen(true);
      return { isValid: false };
    }

    if (!endStationId) {
      setMessage("endStationIsBlankMsg");
      setOpen(true);
      return { isValid: false };
    }

    if (startStationId === endStationId) {
      setMessage("sameStationMsg");
      setOpen(true);
      return { isValid: false };
    }

    const maxDays = DateUtils.getMaxDays(page);
    const maxDate = DateUtils.addDays(DateUtils.getCurrentDate(), maxDays);

    if (
      !date ||
      !time ||
      !DateUtils.isValid(date) ||
      DateUtils.isBefore(date, DateUtils.getCurrentDate()) ||
      DateUtils.isAfter(date, maxDate)
    ) {
      setMessage("datetimeNotAllowMsg");
      setOpen(true);
      return {
        isValid: false,
        isDateInValid: true,
      };
    }

    return { isValid: true };
  };

  return {
    isParamsValid,
    validationAlert: { message, setMessage, open, setOpen },
  };
};

export default useParamsValidation;
