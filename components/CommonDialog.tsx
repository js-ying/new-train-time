import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useTranslation } from "next-i18next";

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

const CommonDialog = ({ open, setOpen, alertMsg }) => {
  const { t } = useTranslation();

  return (
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
  );
};

export default CommonDialog;
