import { useTranslation } from "next-i18next";
import Image from "next/image";
import { FC, ReactNode } from "react";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import AddToScreenIcon from "../icons/AddToScreenIcon";
import ShareIcon from "../icons/ShareIcon";

// 步驟文字：序號獨立一欄，換行時文字對齊序號之後
const StepText: FC<{ no: number; children: ReactNode }> = ({
  no,
  children,
}) => (
  <div className="flex">
    <span className="mr-1 shrink-0">{no}.</span>
    <span>{children}</span>
  </div>
);

const IOSandSafariPWATip: FC = () => {
  const { t } = useTranslation();
  // macOS Safari 的選項是「加入 Dock 中」，非 iOS 的「加入主畫面」
  const { isMacSafari } = useDeviceDetect();

  return (
    <>
      <ol className="text-left">
        <li className="mb-1 flex items-center">
          <ShareIcon />
          <StepText no={1}>{t("pwaIOSStep1")}</StepText>
        </li>
        <li className="mb-1 flex items-center">
          <AddToScreenIcon />
          <StepText no={2}>
            {isMacSafari ? t("pwaSafariDesktopStep2") : t("pwaStep2")}
          </StepText>
        </li>
        <li className="flex items-center">
          <div className="flex h-8 w-12 items-center justify-center">
            <Image
              src={`/images/logos/logo-32.png`}
              alt="traintime-logo"
              width={26}
              height={26}
              className="rounded"
            />
          </div>
          <StepText no={3}>{t("installedSuccessfullyMsg")}</StepText>
        </li>
      </ol>
    </>
  );
};

export default IOSandSafariPWATip;
