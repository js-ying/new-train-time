import Loading from "@/components/common/Loading";
import CaptureIcon from "@/components/icons/CaptureIcon";
import { GaEnum } from "@/enums/GaEnum";
import { useCaptureShare } from "@/hooks/useCaptureShare";
import {
  JsyThsrInfo,
  ThsrDailyTimetable,
  ThsrOdFare,
  ThsrTdxGeneralTimeTable,
} from "@/models/jsy-thsr-info";
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
import { useTranslation } from "next-i18next";
import { FC } from "react";
import ThsrStopTimesTable from "./details/ThsrStopTimesTable";
import ThsrTrainDetail from "./details/ThsrTrainDetail";

interface ThsrTrainTimeDetailDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  thsrTrainTimeTable: ThsrDailyTimetable;
  thsrFreeSeatingCars: JsyThsrInfo["freeSeatingCars"];
  thsrTdxGeneralTimeTable: ThsrTdxGeneralTimeTable[];
  thsrOdFare: ThsrOdFare[];
  isGeneralTimetable: boolean;
}

const ThsrTrainTimeDetailDialog: FC<ThsrTrainTimeDetailDialogProps> = ({
  open,
  setOpen,
  thsrTrainTimeTable,
  thsrFreeSeatingCars,
  thsrTdxGeneralTimeTable,
  thsrOdFare,
  isGeneralTimetable,
}) => {
  const { t, i18n } = useTranslation();

  const { isCapturing, capture } = useCaptureShare({
    selector: ".thsr-detail-dialog",
    imageNamePrefix: `${thsrTrainTimeTable.TrainDate}_${thsrTrainTimeTable.DailyTrainInfo.TrainNo}`,
    gaEventName: GaEnum.THSR_TRAIN_DETAIL_CAPTURE,
  });

  return (
    <>
      <Modal
        isOpen={open}
        onOpenChange={setOpen}
        classNames={{
          wrapper: `thsr-detail-dialog ${isCapturing ? "h-fit" : ""}`,
          base: "bg-white dark:bg-eerieBlack-500",
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
                <ThsrTrainDetail
                  thsrTrainTimeTable={thsrTrainTimeTable}
                  thsrFreeSeatingCars={thsrFreeSeatingCars}
                  thsrOdFare={thsrOdFare}
                  thsrTdxGeneralTimeTable={thsrTdxGeneralTimeTable}
                />
                <div className="mt-6">
                  <ThsrStopTimesTable
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
                {!isCapturing && (
                  <div className="relative mt-1 flex justify-center">
                    <Button
                      size="sm"
                      className="bg-silverLakeBlue-500 text-white dark:bg-gamboge-500 dark:text-eerieBlack-500"
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
