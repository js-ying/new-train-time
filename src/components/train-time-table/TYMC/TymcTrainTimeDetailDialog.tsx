import Loading from "@/components/common/Loading";
import CaptureIcon from "@/components/icons/CaptureIcon";
import { GaEnum } from "@/enums/GaEnum";
import useLang from "@/hooks/useLang";
import usePage from "@/hooks/usePage";
import { JsyTymcInfo } from "@/models/jsy-tymc-info";
import { gaClickEvent } from "@/utils/GaUtils";
import { getStationNameById } from "@/utils/StationUtils";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useToPng } from "@hugocxl/react-to-image";
import { Chip } from "@mui/material";
import { useTranslation } from "next-i18next";
import { Dispatch, FC, Fragment, SetStateAction, useState } from "react";
import TymcFareInfo from "./TymcFareInfo";

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
  const { page } = usePage();
  const { t, i18n } = useTranslation();
  const { isTw } = useLang();

  const [capturing, setCapturing] = useState(false);

  const [_, downloadPng] = useToPng<HTMLDivElement>({
    selector: ".thsr-detail-dialog",
    quality: 0.8,
    onSuccess: async (base64Image: string) => {
      const imageName = `${trainDate}_tymc_${tymcTimeTable.DepartureTime.replace(":", "")}`;

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
    gaClickEvent(GaEnum.TYMC_TRAIN_DETAIL_CAPTURE);
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
              <ModalHeader>{t("trainDetail")}</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-2">
                  {/* 車站 */}
                  <div className="flex gap-2">
                    <Chip label={t("station")} size="small" color="primary" />
                    <div className="flex items-center text-left">
                      {getStationNameById(page, startStationId, i18n.language)}{" "}
                      - {getStationNameById(page, endStationId, i18n.language)}
                    </div>
                  </div>
                  {/* 日期 */}
                  <div className="flex gap-2">
                    <Chip label={t("date")} size="small" color="primary" />
                    <div className="flex items-center text-left">
                      {trainDate}
                    </div>
                  </div>
                  {/* 時間 */}
                  <div className="flex gap-2">
                    <Chip label={t("time")} size="small" color="primary" />
                    <div className="text-left">
                      {tymcTimeTable.DepartureTime} -{" "}
                      {tymcTimeTable.jsyArrivalTime}{" "}
                      <span className="whitespace-nowrap">
                        ± 3 {t("minute")}
                      </span>
                      <span
                        className={`text-zinc-500 dark:text-zinc-400 ${!isTw && "pl-1"}`}
                      >
                        {t("arrivalTimeAccuracyMsg")}
                      </span>
                    </div>
                  </div>
                  {/* 票價 */}
                  <div className="flex gap-2">
                    <Chip
                      label={t("ticketFare")}
                      size="small"
                      color="primary"
                    />
                    <div className="text-left">
                      <TymcFareInfo fares={fareList} />
                    </div>
                  </div>
                </div>
                {/* 停靠車站 */}
                <div className="mt-6">
                  <div className="border- border-y border-silverLakeBlue-500 py-2 text-center font-bold text-silverLakeBlue-500 dark:border-gamboge-500 dark:text-gamboge-500">
                    {t("stoppingStation")}
                  </div>
                </div>
                <div className="text-justify">
                  {tymcTimeTable.jsyStoppingStationIdList.map(
                    (stationId: string, index: number) => (
                      <Fragment key={stationId}>
                        <span
                          className={`${
                            [startStationId, endStationId].includes(stationId)
                              ? "font-bold text-silverLakeBlue-500 dark:text-gamboge-500"
                              : ""
                          }`}
                        >
                          {getStationNameById(page, stationId, i18n.language)}
                        </span>
                        {index <
                          tymcTimeTable.jsyStoppingStationIdList.length - 1 &&
                          " → "}
                      </Fragment>
                    ),
                  )}
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
      {capturing && <Loading />}
    </>
  );
};

export default TymcTrainTimeDetailDialog;
