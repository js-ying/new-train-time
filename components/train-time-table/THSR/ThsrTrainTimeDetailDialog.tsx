import Chip from "@mui/material/Chip";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useTranslation } from "next-i18next";
import { FC } from "react";
import {
  ThsrDailyFreeSeatingCar,
  ThsrDailyTimetable,
  ThsrGeneralTimeTable,
  ThsrOdFare,
  ThsrTdxGeneralTimeTable,
} from "../../../types/thsr-train-time-table";
import { getTdxLang } from "../../../utils/LocaleUtils";
import { getThsrGeneralTrainInfo } from "../../../utils/TrainInfoUtils";
import Dot from "../../Dot";
import ThsrFreeSeat from "./ThsrFreeSeat";
import ThsrPriceInfo from "./ThsrPriceInfo";
import ThsrServiceDay from "./ThsrServiceDay";

interface TrainDetailProps {
  thsrTrainTimeTable: ThsrDailyTimetable;
  thsrDailyFreeSeatingCar: ThsrDailyFreeSeatingCar;
  thsrOdFare: ThsrOdFare[];
  thsrTdxGeneralTimeTable: ThsrTdxGeneralTimeTable[];
}

const TrainDetail: FC<TrainDetailProps> = ({
  thsrTrainTimeTable,
  thsrDailyFreeSeatingCar,
  thsrOdFare,
  thsrTdxGeneralTimeTable,
}) => {
  const { t, i18n } = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Chip label={t("station")} size="small" color="primary" />
        <div className="flex items-center">
          {
            thsrTrainTimeTable.OriginStopTime.StationName[
              getTdxLang(i18n.language)
            ]
          }{" "}
          -{" "}
          {
            thsrTrainTimeTable.DestinationStopTime.StationName[
              getTdxLang(i18n.language)
            ]
          }
        </div>
      </div>
      <div className="flex gap-2">
        <Chip label={t("timeRange")} size="small" color="primary" />
        <div className="flex items-center">
          {thsrTrainTimeTable.OriginStopTime.DepartureTime} -{" "}
          {thsrTrainTimeTable.DestinationStopTime.ArrivalTime}
        </div>
      </div>
      <div className="flex gap-2">
        <Chip label={t("ticketFare")} size="small" color="primary" />
        <div className="flex items-center text-sm">
          <ThsrPriceInfo dataList={thsrOdFare} showLabel={false} />
        </div>
      </div>
      <div className="flex gap-2">
        <Chip label={t("freeSeating")} size="small" color="primary" />
        <div className="flex items-center text-sm">
          <ThsrFreeSeat
            trainNo={thsrTrainTimeTable.DailyTrainInfo.TrainNo}
            freeSeatData={thsrDailyFreeSeatingCar}
            showLabel={false}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Chip label={t("note")} size="small" color="primary" />
        <div className="flex items-center">
          <ThsrServiceDay
            trainNo={thsrTrainTimeTable.DailyTrainInfo.TrainNo}
            generalTimeTable={thsrTdxGeneralTimeTable}
          />
        </div>
      </div>
    </div>
  );
};

interface StopTimesTableProps {
  data: ThsrGeneralTimeTable | null;
  startStationId: string;
  endStationId: string;
}

const StopTimesTable: FC<StopTimesTableProps> = ({
  data,
  startStationId,
  endStationId,
}) => {
  const { t, i18n } = useTranslation();

  return (
    <>
      <div className="flex font-bold">
        {["stationName", "arrivalTime", "leaveTime"].map((title) => {
          return (
            <div
              className="border- flex-1 border-y border-silverLakeBlue-500 py-2 text-center text-silverLakeBlue-500 dark:border-gamboge-500 dark:text-gamboge-500"
              key={title}
            >
              {t(title)}
            </div>
          );
        })}
      </div>
      {data?.StopTimes.map((stopTime) => {
        return (
          <div
            className={`mt-2 flex ${
              [startStationId, endStationId].includes(stopTime.StationID)
                ? "font-bold text-silverLakeBlue-500 dark:text-gamboge-500"
                : ""
            }`}
            key={stopTime.StationID}
          >
            <div className="relative flex-1 text-center">
              {[startStationId, endStationId].includes(stopTime.StationID) && (
                <Dot />
              )}
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

interface ThsrTrainTimeDetailDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  thsrTrainTimeTable: ThsrDailyTimetable;
  thsrDailyFreeSeatingCar: ThsrDailyFreeSeatingCar;
  thsrTdxGeneralTimeTable: ThsrTdxGeneralTimeTable[];
  thsrOdFare: ThsrOdFare[];
}

const ThsrTrainTimeDetailDialog: FC<ThsrTrainTimeDetailDialogProps> = ({
  open,
  setOpen,
  thsrTrainTimeTable,
  thsrDailyFreeSeatingCar,
  thsrTdxGeneralTimeTable,
  thsrOdFare,
}) => {
  const { t, i18n } = useTranslation();

  return (
    <Modal
      isOpen={open}
      onOpenChange={setOpen}
      classNames={{
        base: "bg-white dark:bg-eerieBlack-500",
        header: "flex items-center justify-center gap-2",
      }}
      scrollBehavior="inside"
      size="2xl"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              {thsrTrainTimeTable.DailyTrainInfo.TrainNo}{" "}
              {
                thsrTrainTimeTable.DailyTrainInfo.StartingStationName[
                  getTdxLang(i18n.language)
                ]
              }{" "}
              -{" "}
              {
                thsrTrainTimeTable.DailyTrainInfo.EndingStationName[
                  getTdxLang(i18n.language)
                ]
              }
            </ModalHeader>
            <ModalBody>
              <TrainDetail
                thsrTrainTimeTable={thsrTrainTimeTable}
                thsrDailyFreeSeatingCar={thsrDailyFreeSeatingCar}
                thsrOdFare={thsrOdFare}
                thsrTdxGeneralTimeTable={thsrTdxGeneralTimeTable}
              />
              <div className="mt-6">
                <StopTimesTable
                  data={getThsrGeneralTrainInfo(
                    thsrTdxGeneralTimeTable,
                    thsrTrainTimeTable.DailyTrainInfo.TrainNo,
                  )}
                  startStationId={thsrTrainTimeTable.OriginStopTime.StationID}
                  endStationId={
                    thsrTrainTimeTable.DestinationStopTime.StationID
                  }
                />
              </div>
            </ModalBody>
            <ModalFooter className="mt-1 justify-center">
              <Button
                size="sm"
                className="bg-silverLakeBlue-500 text-white dark:bg-gamboge-500 dark:text-eerieBlack-500"
                onPress={onClose}
              >
                {t("closeBtn")}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ThsrTrainTimeDetailDialog;
