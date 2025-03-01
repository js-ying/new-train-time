import CaptureIcon from "@/components/icons/CaptureIcon";
import Loading from "@/components/layout/Loading";
import { GaEnum } from "@/enums/GaEnum";
import useLang from "@/hooks/useLangHook";
import { JsyTrTrainTimeTable } from "@/models/tr-train-time-table";
import { gaClickEvent } from "@/utils/GaUtils";
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
import { useToPng } from "@hugocxl/react-to-image";
import Chip from "@mui/material/Chip";
import { useTranslation } from "next-i18next";
import { FC, useState } from "react";
import Dot from "../Dot";
import { trTrainServiceList } from "./TrTrainServices";

interface TrainDetailProps {
  data: JsyTrTrainTimeTable;
}

const TrainDetail: FC<TrainDetailProps> = ({ data }) => {
  const { t, i18n } = useTranslation();
  const { isTw } = useLang();

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
          {data.trainDate} {data.StopTimes[0].DepartureTime} -{" "}
          {data.StopTimes[data.StopTimes.length - 1].ArrivalTime}
        </div>
      </div>
      <div className="flex gap-2">
        <Chip label={t("ticketFare")} size="small" color="primary" />
        <div className="items-center">
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
        <div>
          {trTrainServiceList
            .filter((service) => data.TrainInfo[service.flagName] === 1)
            .map((service) => t(`trainService${service.flagName}`))
            .join(t("comma"))}

          {trTrainServiceList.filter(
            (service) => data.TrainInfo[service.flagName] === 1,
          ).length === 0 && t("none")}
        </div>
      </div>
      {isTw && (
        <div className="flex gap-2">
          <Chip label={t("note")} size="small" color="primary" />
          <div className="flex items-center">{data.TrainInfo.Note}</div>
        </div>
      )}
    </div>
  );
};

interface StopTimesTableProps {
  data: JsyTrTrainTimeTable;
}

const StopTimesTable: FC<StopTimesTableProps> = ({ data }) => {
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
      {data.StopTimes.map((stopTime, index) => {
        return (
          <div
            className={`mt-2 flex ${
              index === 0 || index === data.StopTimes.length - 1
                ? "font-bold text-silverLakeBlue-500 dark:text-gamboge-500"
                : ""
            }`}
            key={stopTime.StationID}
          >
            <div className="relative flex-1 text-center">
              {(index === 0 || index === data.StopTimes.length - 1) && <Dot />}
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

  const [capturing, setCapturing] = useState(false);

  const [_, downloadPng] = useToPng<HTMLDivElement>({
    selector: ".tr-detail-dialog",
    quality: 0.8,
    onSuccess: async (base64Image: string) => {
      const imageName = `${data.trainDate}_${data.TrainInfo.TrainNo}`;

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
    gaClickEvent(GaEnum.TR_TRAIN_DETAIL_CAPTURE);
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
          wrapper: `tr-detail-dialog ${capturing ? "h-fit" : ""}`,
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
                <TrainDetail data={data} />
                <div className="mt-6">
                  <StopTimesTable data={data} />
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

export default TrTrainTimeDetailDialog;
