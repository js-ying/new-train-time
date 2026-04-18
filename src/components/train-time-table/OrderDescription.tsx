import { GaEnum } from "@/enums/GaEnum";
import { gaClickEvent } from "@/utils/GaUtils";
import { Image } from "@heroui/react";
import { useTranslation } from "next-i18next";
import { FC, useEffect, useState } from "react";
import CommonDialog from "../common/CommonDialog";
import CommonLightbox from "../common/CommonLightbox";

/** 訂票說明圖片列表（供 Lightbox 使用） */
export const orderDescriptionSlides = [
  {
    src: "https://jsying1994.s3.us-east-1.amazonaws.com/traintime/booking/clickMenu.jpg",
  },
  {
    src: "https://jsying1994.s3.us-east-1.amazonaws.com/traintime/booking/mobileUseAppSetting.jpg",
  },
];

/** 訂票說明彈窗內容（可被外部元件重用） */
export const AnnouncementContent: FC = () => {
  const { t } = useTranslation();
  const translatedTexts = t("announcementTrOrderV1", {
    returnObjects: true,
  }) as string[];

  return (
    <div className="flex flex-col gap-4">
      {translatedTexts.map((text, index) => {
        if (text === "__TABLE__") {
          return (
            <div
              key={index}
              className="overflow-hidden rounded-md border border-zinc-400 dark:border-zinc-500"
            >
              <table className="w-full text-center text-sm">
                <thead className="bg-neutral-300 dark:bg-neutral-700">
                  <tr className="border-b border-zinc-400 dark:border-zinc-500">
                    <th className="border-r border-zinc-400 p-2 dark:border-zinc-500">
                      {t("railway")}
                    </th>
                    <th className="border-r border-zinc-400 p-2 dark:border-zinc-500">
                      {t("realTimeSeatData")}
                    </th>
                    <th className="p-2">{t("bookingBtnCondition")}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-zinc-400 dark:border-zinc-500">
                    <td className="border-r border-zinc-400 p-2 font-bold dark:border-zinc-500">
                      {t("tr")}
                    </td>
                    <td className="border-r border-zinc-400 p-2 text-orange-600 dark:border-zinc-500 dark:text-orange-400">
                      {t("waitingForTdx")}
                    </td>
                    <td className="p-2">{t("alwaysShow")}</td>
                  </tr>
                  <tr>
                    <td className="border-r border-zinc-400 p-2 font-bold dark:border-zinc-500">
                      {t("thsr")}
                    </td>
                    <td className="border-r border-zinc-400 p-2 text-emerald-600 dark:border-zinc-500 dark:text-emerald-400">
                      {t("seatDataConnected")}
                    </td>
                    <td className="p-2">{t("showWhenSeatsAvailable")}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          );
        }
        return <p key={index}>{text}</p>;
      })}
    </div>
  );
};

const OrderDescription: FC = () => {
  const { t } = useTranslation();
  const [openAnnouncement, setOpenAnnouncement] = useState(false);
  const [openAnnouncementCheckbox, setOpenAnnouncementCheckbox] =
    useState(false);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState(-1);

  // 使用統一定義的圖片資料
  const slides = orderDescriptionSlides;

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
        <AnnouncementContent />

        <div className="mt-2 flex gap-2">
          {slides.map((slide, index) => (
            <div key={index} className="aspect-[855/1440] flex-1">
              <Image
                src={slide.src}
                alt={`order-step-${index}`}
                onClick={() => setActiveLightboxIndex(index)}
                classNames={{
                  // 覆寫 HeroUI 預設的 max-w-fit，強制讓 Skeleton 與 Image 外層填滿預先定義的比例框
                  wrapper: "!max-w-full w-full h-full",
                  img: "w-full h-full object-cover custom-cursor-pointer border-1 border-zinc-400 dark:border-zinc-500",
                }}
              />
            </div>
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
        <AnnouncementContent />
      </CommonDialog>
    </>
  );
};

export default OrderDescription;
