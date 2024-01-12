import { Grow } from "@mui/material";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useTranslation } from "next-i18next";
import { TrTrainTimeTable } from "../../../types/tr-train-time-table";
import { getTdxLang } from "../../../utils/locale-utils";
import {
  getTrTrainTypeNameByCode,
  getTrTripLineNameByValue,
} from "../../../utils/train-info-utils";
import { trTrainServiceList } from "./TrTrainServices";

const TrainDetail = ({ data }: { data: TrTrainTimeTable }) => {
  const { t, i18n } = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Chip label={t("station")} size="small" color="primary" />
        <div className="flex items-center">
          {data.StopTimes[0].StationName[getTdxLang(i18n.language)]} -{" "}
          {
            data.StopTimes[data.StopTimes.length - 1].StationName[
              getTdxLang(i18n.language)
            ]
          }
        </div>
      </div>
      <div className="flex gap-2">
        <Chip label={t("timeRange")} size="small" color="primary" />
        <div className="flex items-center">
          {data.StopTimes[0].DepartureTime} -{" "}
          {data.StopTimes[data.StopTimes.length - 1].ArrivalTime}
        </div>
      </div>
      <div className="flex gap-2">
        <Chip label={t("ticketFare")} size="small" color="primary" />
        <div className="flex items-center">
          <span>
            {t("adultPrice")} NTD{" "}
            {data.fareList.length > 0 && data.fareList[0].Price}
          </span>
          {t("comma")}
          <span>
            {t("discountedPrice")} NTD{" "}
            {data.fareList.length > 0 &&
              (data.fareList[0].Price / 2).toFixed(0)}
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <Chip label={t("trainServices")} size="small" color="primary" />
        <div className="flex items-center">
          {trTrainServiceList
            .filter((service) => data.TrainInfo[service.flagName] === 1)
            .map((service) => t(`trainService${service.flagName}`))
            .join(t("comma"))}

          {trTrainServiceList.filter(
            (service) => data.TrainInfo[service.flagName] === 1,
          ).length === 0 && t("none")}
        </div>
      </div>
      <div className="flex gap-2">
        <Chip label={t("note")} size="small" color="primary" />
        <div className="flex items-center">{data.TrainInfo.Note}</div>
      </div>
    </div>
  );
};

const StopTimesTable = ({ data }: { data: TrTrainTimeTable }) => {
  const { t, i18n } = useTranslation();

  return (
    <>
      <div className="flex">
        {["stationName", "arrivalTime", "leaveTime"].map((title) => {
          return (
            <div
              className="border- dark:border-gamboge dark:text-gamboge flex-1 border-y border-grayBlue py-2 text-center text-grayBlue"
              key={title}
            >
              {t(title)}
            </div>
          );
        })}
      </div>
      {data.StopTimes.map((stopTime) => {
        return (
          <div className="mt-2 flex" key={stopTime.StationID}>
            <div className="flex-1 text-center">
              {stopTime.StationName[getTdxLang(i18n.language)]}
            </div>
            <div className="flex-1 text-center">{stopTime.ArrivalTime}</div>
            <div className="flex-1 text-center">{stopTime.DepartureTime}</div>
          </div>
        );
      })}
    </>
  );
};

const TrTrainTimeDetailDialog = ({
  open,
  setOpen,
  data,
}: {
  open: boolean;
  setOpen: Function;
  data: TrTrainTimeTable;
}) => {
  const { t, i18n } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      maxWidth="sm"
      TransitionComponent={Grow}
      PaperProps={{
        style: { borderRadius: 20 },
      }}
    >
      <DialogTitle id="alert-dialog-title">
        <div className="flex items-center gap-2">
          {data.TrainInfo.TrainNo}{" "}
          {getTrTripLineNameByValue(data.TrainInfo.TripLine, i18n.language)}{" "}
          {getTrTrainTypeNameByCode(
            data.TrainInfo.TrainTypeCode,
            i18n.language,
          )}{" "}
          {data.TrainInfo.StartingStationName[getTdxLang(i18n.language)]} -{" "}
          {data.TrainInfo.EndingStationName[getTdxLang(i18n.language)]}
        </div>
      </DialogTitle>
      <DialogContent className="text-sm">
        <TrainDetail data={data} />
        <div className="mt-6">
          <StopTimesTable data={data} />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} autoFocus>
          {t("closeBtn")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TrTrainTimeDetailDialog;
