import { GaEnum } from "@/enums/GaEnum";
import { gaClickEvent } from "@/utils/GaUtils";
import { useTranslation } from "next-i18next";
import { FC, useEffect, useState } from "react";
import CommonDialog from "../CommonDialog";

const TrOrderDescription: FC = () => {
  const { t } = useTranslation();
  const [openAnnouncement, setOpenAnnouncement] = useState(false);
  const [openAnnouncementCheckbox, setOpenAnnouncementCheckbox] =
    useState(false);

  useEffect(() => {
    // setOpenAnnouncementCheckbox(
    //   window.localStorage.getItem("announcementTrOrderV1_disabled")
    //     ? false
    //     : true,
    // );
  }, []);

  return (
    <>
      <div className="text-center">
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
      >
        {t("announcementTrOrderV1")}
      </CommonDialog>

      {/* 有 checkbox 版 (公告) */}
      <CommonDialog
        open={openAnnouncementCheckbox}
        setOpen={setOpenAnnouncementCheckbox}
        title="announcementTitle"
        bodyTextAlign="text-left"
        enableDoNotShowAgainCheckbox={true}
      >
        {t("announcementTrOrderV1")}
      </CommonDialog>
    </>
  );
};

export default TrOrderDescription;
