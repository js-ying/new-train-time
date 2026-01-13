import { GaEnum } from "@/enums/GaEnum";
import { gaClickEvent } from "@/utils/GaUtils";
import { Image } from "@heroui/react";
import { useTranslation } from "next-i18next";
import { FC, useEffect, useState } from "react";
import CommonDialog from "../CommonDialog";
import CommonLightbox from "../CommonLightbox";

const OrderDescription: FC = () => {
  const { t } = useTranslation();
  const [openAnnouncement, setOpenAnnouncement] = useState(false);
  const [openAnnouncementCheckbox, setOpenAnnouncementCheckbox] =
    useState(false);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState(-1);

  const slides = [
    {
      src: "https://jsying1994.s3.us-east-1.amazonaws.com/traintime/booking/clickMenu.jpg",
    },
    {
      src: "https://jsying1994.s3.us-east-1.amazonaws.com/traintime/booking/mobileUseAppSetting.jpg",
    },
  ];

  useEffect(() => {
    // setOpenAnnouncementCheckbox(
    //   window.localStorage.getItem("announcementTrOrderV1_disabled")
    //     ? false
    //     : true,
    // );
  }, []);

  return (
    <>
      <div className="mx-auto w-fit text-center">
        <span
          tabIndex={0}
          role="button"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              gaClickEvent(GaEnum.TR_ORDER_DESCRIPTION);
              setOpenAnnouncement(true);
            }
          }}
          className="custom-cursor-pointer whitespace-pre-line text-center text-sm
          text-zinc-500 underline dark:text-zinc-400"
          onClick={() => {
            gaClickEvent(GaEnum.TR_ORDER_DESCRIPTION);
            setOpenAnnouncement(true);
          }}
        >
          {t("trOrderDescription")}
        </span>
      </div>

      {/* 無 checkbox 版 (訂票說明) */}
      <CommonDialog
        open={openAnnouncement}
        setOpen={setOpenAnnouncement}
        title="trOrderDescription"
        bodyTextAlign="text-left"
        size="md"
        isDismissable={activeLightboxIndex === -1}
        isKeyboardDismissDisabled={activeLightboxIndex !== -1}
      >
        <div className="flex flex-col gap-4">
          {(
            t("announcementTrOrderV1", { returnObjects: true }) as string[]
          ).map((text, index) => (
            <p key={index}>{text}</p>
          ))}
        </div>

        <div className="flex gap-2">
          {slides.map((slide, index) => (
            <Image
              key={index}
              src={slide.src}
              alt={`order-step-${index}`}
              className="custom-cursor-pointer"
              onClick={() => setActiveLightboxIndex(index)}
            />
          ))}
        </div>
      </CommonDialog>

      <CommonLightbox
        slides={slides}
        open={activeLightboxIndex >= 0}
        index={activeLightboxIndex}
        onClose={() => setActiveLightboxIndex(-1)}
      />

      {/* 有 checkbox 版 (公告) */}
      <CommonDialog
        open={openAnnouncementCheckbox}
        setOpen={setOpenAnnouncementCheckbox}
        title="announcementTitle"
        bodyTextAlign="text-left"
        enableDoNotShowAgainCheckbox={true}
      >
        <div className="flex flex-col gap-4">
          {(
            t("announcementTrOrderV1", { returnObjects: true }) as string[]
          ).map((text, index) => (
            <p key={index}>{text}</p>
          ))}
        </div>
      </CommonDialog>
    </>
  );
};

export default OrderDescription;
