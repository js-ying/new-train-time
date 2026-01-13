import Loading from "@/components/common/Loading";
import CaptureIcon from "@/components/icons/CaptureIcon";
import { GaEnum } from "@/enums/GaEnum";
import { useCaptureShare } from "@/hooks/useCaptureShare";
import { JsyTymcInfo } from "@/models/jsy-tymc-info";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useTranslation } from "next-i18next";
import { Dispatch, FC, SetStateAction } from "react";
import TymcStoppingStations from "./details/TymcStoppingStations";
import TymcTrainDetail from "./details/TymcTrainDetail";

interface TymcTrainTimeDetailDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  tymcTimeTable: JsyTymcInfo["timeTables"][0];
  fareList: JsyTymcInfo["fareList"];
  trainDate: string;
  startStationId: string;
  endStationId: string;
}

const TymcTrainTimeDetailDialog: FC<TymcTrainTimeDetailDialogProps> = ({
  open,
  setOpen,
  tymcTimeTable,
  trainDate,
  startStationId,
  endStationId,
  fareList,
}) => {
  const { t } = useTranslation();

  const { isCapturing, capture } = useCaptureShare({
    selector: ".tymc-detail-dialog",
    imageNamePrefix: `${trainDate}_tymc_${tymcTimeTable.DepartureTime.replace(":", "")}`,
    gaEventName: GaEnum.TYMC_TRAIN_DETAIL_CAPTURE,
  });

  return (
    <>
      <Modal
        isOpen={open}
        onOpenChange={setOpen}
        classNames={{
          wrapper: `tymc-detail-dialog ${isCapturing ? "h-fit" : ""}`,
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
              <ModalHeader>{t("trainDetail")}</ModalHeader>
              <ModalBody>
                <TymcTrainDetail
                  tymcTimeTable={tymcTimeTable}
                  trainDate={trainDate}
                  startStationId={startStationId}
                  endStationId={endStationId}
                  fareList={fareList}
                />
                <TymcStoppingStations
                  stoppingStationIdList={tymcTimeTable.jsyStoppingStationIdList}
                  startStationId={startStationId}
                  endStationId={endStationId}
                />
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

export default TymcTrainTimeDetailDialog;
