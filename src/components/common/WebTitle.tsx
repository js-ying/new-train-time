import { notTransportPage, PageEnum } from "@/enums/PageEnum";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { FC } from "react";
import useLang from "../../hooks/useLang";
import usePage from "../../hooks/usePage";
import useTransportNavClick from "../../hooks/useTransportNavClick";
import TrainSwitch from "./TrainSwitch";

const WebTitle: FC = () => {
  const { t } = useTranslation();
  const { isTw } = useLang();
  const { homePath, page } = usePage();
  const handleTitleClick = useTransportNavClick();

  return (
    <div className="flex flex-col items-center">
      {/* Main Title */}
      <Link
        href={homePath}
        onClick={() => handleTitleClick(page)}
        className="custom-cursor-pointer mb-2"
      >
        <h1 className={`font-bold ${isTw ? "text-xl" : "text-lg"}`}>
          {/* 公車為即時到站、非時刻表，用專屬 busTitle，不接「時刻查詢」後綴 */}
          {page === PageEnum.BUS ? (
            t("busTitle")
          ) : (
            <>
              <span className={`${isTw ? "" : "pr-1"}`}>
                {notTransportPage.includes(page) ? t(PageEnum.TR) : t(page)}
              </span>
              {t("scheduleInquiry")}
            </>
          )}
        </h1>
      </Link>

      {/* Transport Tabs */}
      <TrainSwitch />
    </div>
  );
};

export default WebTitle;
