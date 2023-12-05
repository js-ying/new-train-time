import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import Dialog from "@mui/material/Dialog";
import { SearchAreaContext } from "../contexts/SearchAreaContext";
import { getTrStationNameById } from "../utils/station-utils";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import DateUtils from "../utils/date-utils";

const ErrorIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-6 w-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
      />
    </svg>
  );
};

const SearchButton = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const params = useContext(SearchAreaContext);
  const [open, setOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);

  const checkParams = (
    startStationId: string,
    endStationId: string,
    date: string,
    callBack: Function,
  ) => {
    if (!startStationId && !endStationId) {
      setAlertMsg("bothStationAreBlank");
      setOpen(true);
      return;
    }

    if (
      DateUtils.isBefore(date, DateUtils.getCurrentDate()) ||
      DateUtils.isAfter(date, DateUtils.addMonth(DateUtils.getCurrentDate(), 2))
    ) {
      setAlertMsg("datetimeNotAllow");
      setOpen(true);
      return;
    }

    callBack();
  };

  const handleSearch = () => {
    checkParams(params.startStation, params.endStation, params.date, () => {
      router.push({
        pathname: "/TR/search",
        query: {
          s: getTrStationNameById(params.startStation, i18n.language),
          e: getTrStationNameById(params.endStation, i18n.language),
          d: params.date,
          t: params.time.replace(":", ""),
        },
      });
    });
  };

  return (
    <>
      <button
        type="button"
        className="
            cursor-pointer rounded-md bg-zinc-700 px-4 py-2 text-white
            transition duration-150 ease-out 
            hover:bg-zinc-700/80 dark:bg-grayBlue hover:dark:bg-grayBlue/80
            "
        onClick={() => handleSearch()}
      >
        {t("searchBtn")}
      </button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <div className="flex items-center gap-2">
            {<ErrorIcon />} {t("errorAlertTitle")}
          </div>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t(alertMsg)}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} autoFocus>
            {t("closeBtn")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SearchButton;
