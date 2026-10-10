import useStationName from "@/hooks/useStationName";
import { PageEnum } from "@/enums/PageEnum";
import Loading from "@/components/common/Loading";
import CaptureIcon from "@/components/icons/CaptureIcon";
import { GaEnum } from "@/enums/GaEnum";
import { useCaptureShare } from "@/hooks/useCaptureShare";
import {
  JsyThsrInfo,
  JsyThsrOdFare,
  JsyThsrTimetable,
} from "@/models/jsy-thsr-info";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/common/SwipeableModal";
import { Button } from "@heroui/react";
import { useTranslation } from "next-i18next";
import { FC } from "react";
import ThsrStopTimesTable from "./details/ThsrStopTimesTable";
import ThsrTrainDetail from "./details/ThsrTrainDetail";

interface ThsrTrainTimeDetailDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  thsrTrainTimeTable: JsyThsrTimetable;
  thsrFreeSeatingCars: JsyThsrInfo["freeSeatingCars"];
  thsrOdFare: JsyThsrOdFare[];
  isGeneralTimetable: boolean;
}

const ThsrTrainTimeDetailDialog: FC<ThsrTrainTimeDetailDialogProps> = ({
  open,
  setOpen,
  thsrTrainTimeTable,
  thsrFreeSeatingCars,
  thsrOdFare,
  isGeneralTimetable,
}) => {
  const { t } = useTranslation();
  const stationName = useStationName(PageEnum.THSR);

  const { isCapturing, capture } = useCaptureShare({
    selector: ".thsr-detail-dialog",
    imageNamePrefix: `${thsrTrainTimeTable.trainDate}_${thsrTrainTimeTable.trainInfo.trainNo}`,
    gaEventName: GaEnum.THSR_TRAIN_DETAIL_CAPTURE,
  });

  return (
    <>
      <Modal
        isOpen={open}
        onOpenChange={setOpen}
        classNames={{
          wrapper: `thsr-detail-dialog ${isCapturing ? "h-fit" : ""}`,
          base: "bg-background",
          header: "flex items-center justify-center gap-2",
        }}
        scrollBehavior={isCapturing ? "outside" : "inside"}
        size="2xl"
        hideCloseButton={isCapturing}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {thsrTrainTimeTable.trainInfo.trainNo}{" "}
                {stationName(
                  thsrTrainTimeTable.trainInfo.startingStationId,
                  thsrTrainTimeTable.trainInfo.startingStationName,
                )}{" "}
                -{" "}
                {stationName(
                  thsrTrainTimeTable.trainInfo.endingStationId,
                  thsrTrainTimeTable.trainInfo.endingStationName,
                )}
              </ModalHeader>
              <ModalBody>
                <ThsrTrainDetail
                  thsrTrainTimeTable={thsrTrainTimeTable}
                  thsrFreeSeatingCars={thsrFreeSeatingCars}
                  thsrOdFare={thsrOdFare}
                />
                <div className="mt-6">
                  <ThsrStopTimesTable
                    stopTimes={thsrTrainTimeTable.stopTimes}
                    startStationId={thsrTrainTimeTable.originStopTime.stationId}
                    endStationId={
                      thsrTrainTimeTable.destinationStopTime.stationId
                    }
                  />
                </div>
              </ModalBody>
              <ModalFooter className="justify-center">
                {!isCapturing && (
                  <div className="relative mt-1 flex justify-center">
                    <Button
                      size="sm"
                      className="bg-primary text-primary-foreground"
                      onPress={onClose}
                    >
                      {t("closeBtn")}
                    </Button>
                    <div className="absolute left-[65px]">
                      <Button
                        variant="light"
                        size="sm"
                        onPress={capture}
                        aria-label="capture-btn"
                      >
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
      {isCapturing && <Loading />}
    </>
  );
};

export default ThsrTrainTimeDetailDialog;
