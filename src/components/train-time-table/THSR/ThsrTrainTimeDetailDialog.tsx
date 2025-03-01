import CaptureIcon from "@/components/icons/CaptureIcon";
import Loading from "@/components/layout/Loading";
import { GaEnum } from "@/enums/GaEnum";
import {
  JsyThsrInfo,
  ThsrDailyTimetable,
  ThsrGeneralTimeTable,
  ThsrOdFare,
  ThsrTdxGeneralTimeTable,
} from "@/models/jsy-thsr-info";
import { gaClickEvent } from "@/utils/GaUtils";
import { getTdxLang } from "@/utils/LocaleUtils";
import { getThsrGeneralTrainInfo } from "@/utils/TrainInfoUtils";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useToPng } from "@hugocxl/react-to-image";
import Chip from "@mui/material/Chip";
import { useTranslation } from "next-i18next";
import { FC, useState } from "react";
import Dot from "../Dot";
import ThsrFreeSeat from "./ThsrFreeSeat";
import ThsrPriceInfo from "./ThsrPriceInfo";
import ThsrServiceDay from "./ThsrServiceDay";

interface TrainDetailProps {
  thsrTrainTimeTable: ThsrDailyTimetable;
  thsrFreeSeatingCars: JsyThsrInfo["freeSeatingCars"];
  thsrOdFare: ThsrOdFare[];
  thsrTdxGeneralTimeTable: ThsrTdxGeneralTimeTable[];
}

const TrainDetail: FC<TrainDetailProps> = ({
  thsrTrainTimeTable,
  thsrFreeSeatingCars,
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
          {thsrTrainTimeTable.TrainDate}{" "}
          {thsrTrainTimeTable.OriginStopTime.DepartureTime} -{" "}
          {thsrTrainTimeTable.DestinationStopTime.ArrivalTime}
        </div>
      </div>
      <div className="flex gap-2">
        <Chip label={t("ticketFare")} size="small" color="primary" />
        <div className="flex items-center">
          <ThsrPriceInfo dataList={thsrOdFare} showLabel={false} />
        </div>
      </div>
      <div className="flex gap-2">
        <Chip label={t("freeSeating")} size="small" color="primary" />
        <div className="flex items-center">
          <ThsrFreeSeat
            trainNo={thsrTrainTimeTable.DailyTrainInfo.TrainNo}
            freeSeatData={thsrFreeSeatingCars}
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
  thsrFreeSeatingCars: JsyThsrInfo["freeSeatingCars"];
  thsrTdxGeneralTimeTable: ThsrTdxGeneralTimeTable[];
  thsrOdFare: ThsrOdFare[];
}

const ThsrTrainTimeDetailDialog: FC<ThsrTrainTimeDetailDialogProps> = ({
  open,
  setOpen,
  thsrTrainTimeTable,
  thsrFreeSeatingCars,
  thsrTdxGeneralTimeTable,
  thsrOdFare,
}) => {
  const { t, i18n } = useTranslation();

  const [capturing, setCapturing] = useState(false);

  const [_, downloadPng] = useToPng<HTMLDivElement>({
    selector: ".thsr-detail-dialog",
    quality: 0.8,
    onSuccess: async (base64Image: string) => {
      const imageName = `${thsrTrainTimeTable.TrainDate}_${thsrTrainTimeTable.DailyTrainInfo.TrainNo}`;

      if (navigator.canShare) {
        const response = await fetch(base64Image);
        const blob = await response.blob();

        const shareData = {
          files: [new File([blob], `${imageName}.png`, { type: "image/png" })],
        };

        if (navigator.canShare(shareData)) {
          try {
            await navigator.share(shareData);
          } catch {
            setCapturing(false);
          }
        }
      } else {
        const link = document.createElement("a");
        link.download = `${imageName}`;
        link.href = base64Image;
        link.click();
      }

      setCapturing(false);
    },
  });

  const capture = () => {
    setCapturing(true);
    gaClickEvent(GaEnum.THSR_TRAIN_DETAIL_CAPTURE);
    setTimeout(() => {
      downloadPng();
    }, 1000);
  };

  return (
    <>
      <Modal
        isOpen={open}
        onOpenChange={setOpen}
        classNames={{
          wrapper: `thsr-detail-dialog ${capturing ? "h-fit" : ""}`,
          base: "bg-white dark:bg-eerieBlack-500",
          header: "flex items-center justify-center gap-2",
        }}
        scrollBehavior={capturing ? "outside" : "inside"}
        size="2xl"
        hideCloseButton={capturing ? true : false}
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
                  thsrFreeSeatingCars={thsrFreeSeatingCars}
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
              <ModalFooter className="justify-center">
                {!capturing && (
                  <div className="relative mt-1 flex justify-center">
                    <Button
                      size="sm"
                      className="bg-silverLakeBlue-500 text-white dark:bg-gamboge-500 dark:text-eerieBlack-500"
                      onPress={onClose}
                    >
                      {t("closeBtn")}
                    </Button>
                    <div className="absolute left-[65px]">
                      <Button variant="light" size="sm" onClick={capture}>
                        <CaptureIcon />
                      </Button>
                    </div>
                  </div>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {capturing && <Loading />}
    </>
  );
};

export default ThsrTrainTimeDetailDialog;
