import Loading from "@/components/common/Loading";
import CaptureIcon from "@/components/icons/CaptureIcon";
import { GaEnum } from "@/enums/GaEnum";
import { useCaptureShare } from "@/hooks/useCaptureShare";
import {
  JsyThsrGeneralTimetable,
  JsyThsrInfo,
  JsyThsrOdFare,
  JsyThsrTimetable,
} from "@/models/jsy-thsr-info";
import { getNameLangKey } from "@/utils/LocaleUtils";
import { getThsrGeneralTrainInfo } from "@/utils/TrainInfoUtils";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useTranslation } from "next-i18next";
import { FC } from "react";
import ThsrStopTimesTable from "./details/ThsrStopTimesTable";
import ThsrTrainDetail from "./details/ThsrTrainDetail";

interface ThsrTrainTimeDetailDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  thsrTrainTimeTable: JsyThsrTimetable;
  thsrFreeSeatingCars: JsyThsrInfo["freeSeatingCars"];
  thsrGeneralTimeTable: JsyThsrGeneralTimetable[];
  thsrOdFare: JsyThsrOdFare[];
  isGeneralTimetable: boolean;
}

const ThsrTrainTimeDetailDialog: FC<ThsrTrainTimeDetailDialogProps> = ({
  open,
  setOpen,
  thsrTrainTimeTable,
  thsrFreeSeatingCars,
  thsrGeneralTimeTable,
  thsrOdFare,
  isGeneralTimetable,
}) => {
  const { t, i18n } = useTranslation();
  const langKey = getNameLangKey(i18n.language);

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
                {thsrTrainTimeTable.trainInfo.startingStationName[langKey]} -{" "}
                {thsrTrainTimeTable.trainInfo.endingStationName[langKey]}
              </ModalHeader>
              <ModalBody>
                <ThsrTrainDetail
                  thsrTrainTimeTable={thsrTrainTimeTable}
                  thsrFreeSeatingCars={thsrFreeSeatingCars}
                  thsrOdFare={thsrOdFare}
                  thsrGeneralTimeTable={thsrGeneralTimeTable}
                />
                <div className="mt-6">
                  <ThsrStopTimesTable
                    data={getThsrGeneralTrainInfo(
                      thsrGeneralTimeTable,
                      thsrTrainTimeTable.trainInfo.trainNo,
                    )}
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
