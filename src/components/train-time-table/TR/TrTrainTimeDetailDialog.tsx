import Loading from "@/components/common/Loading";
import CaptureIcon from "@/components/icons/CaptureIcon";
import { GaEnum } from "@/enums/GaEnum";
import { useCaptureShare } from "@/hooks/useCaptureShare";
import { JsyTrTimetable } from "@/models/jsy-tr-info";

import { getNameLangKey } from "@/utils/LocaleUtils";
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
  data: JsyTrTimetable;
}

const TrTrainTimeDetailDialog: FC<TrTrainTimeDetailDialogProps> = ({
  open,
  setOpen,
  data,
}) => {
  const { t, i18n } = useTranslation();
  const langKey = getNameLangKey(i18n.language);

  const { isCapturing, capture } = useCaptureShare({
    selector: ".tr-detail-dialog",
    imageNamePrefix: `${data.trainDate}_${data.trainInfo.trainNo}`,

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
                {data.trainInfo.trainNo}{" "}
                {getTrTripLineNameByValue(
                  data.trainInfo.tripLine,
                  i18n.language,
                )}{" "}
                {getTrTrainTypeNameByCode(
                  data.trainInfo.trainTypeCode,
                  i18n.language,
                )}{" "}
                {data.trainInfo.startingStationName[langKey]} -{" "}
                {data.trainInfo.endingStationName[langKey]}
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
