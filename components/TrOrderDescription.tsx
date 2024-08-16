import { useTranslation } from "next-i18next";
import { FC, useEffect, useState } from "react";
import { GaEnum } from "../enums/GaEnum";
import { gaClickEvent } from "../utils/GaUtils";
import CommonDialog from "./CommonDialog";

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
          className="cursor-pointer whitespace-pre-line text-center text-sm
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
        msg="announcementTrOrderV1"
      />

      {/* 有 checkbox 版 (公告) */}
      <CommonDialog
        open={openAnnouncementCheckbox}
        setOpen={setOpenAnnouncementCheckbox}
        title="announcementTitle"
        msg="announcementTrOrderV1"
        enableDoNotShowAgainCheckbox={true}
      />
    </>
  );
};

export default TrOrderDescription;
