import Loading from "@/components/common/Loading";
import CaptureIcon from "@/components/icons/CaptureIcon";
import { GaEnum } from "@/enums/GaEnum";
import { useCaptureShare } from "@/hooks/useCaptureShare";
import { JsyTrTrainTimeTable } from "@/models/tr-train-time-table";
import { getTdxLang } from "@/utils/LocaleUtils";
import {
  getTrTrainTypeNameByCode,
  getTrTripLineNameByValue,
} from "@/utils/TrainInfoUtils";
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
import TrStopTimesTable from "./details/TrStopTimesTable";
import TrTrainDetail from "./details/TrTrainDetail";

interface TrTrainTimeDetailDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: JsyTrTrainTimeTable;
}

const TrTrainTimeDetailDialog: FC<TrTrainTimeDetailDialogProps> = ({
  open,
  setOpen,
  data,
}) => {
  const { t, i18n } = useTranslation();

  const { isCapturing, capture } = useCaptureShare({
    selector: ".tr-detail-dialog",
    imageNamePrefix: `${data.trainDate}_${data.TrainInfo.TrainNo}`,
    gaEventName: GaEnum.TR_TRAIN_DETAIL_CAPTURE,
  });

  return (
    <>
      <Modal
        isOpen={open}
        onOpenChange={setOpen}
        classNames={{
          wrapper: `tr-detail-dialog ${isCapturing ? "h-fit" : ""}`,
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
                {data.TrainInfo.TrainNo}{" "}
                {getTrTripLineNameByValue(
                  data.TrainInfo.TripLine,
                  i18n.language,
                )}{" "}
                {getTrTrainTypeNameByCode(
                  data.TrainInfo.TrainTypeCode,
                  i18n.language,
                )}{" "}
                {data.TrainInfo.StartingStationName[getTdxLang(i18n.language)]}{" "}
                - {data.TrainInfo.EndingStationName[getTdxLang(i18n.language)]}
              </ModalHeader>
              <ModalBody>
                <TrTrainDetail data={data} />
                <div className="mt-6">
                  <TrStopTimesTable data={data} />
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

export default TrTrainTimeDetailDialog;
