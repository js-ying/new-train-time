import { useTranslation } from "next-i18next";
import { FC } from "react";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import AddToScreenIcon from "../icons/AddToScreenIcon";
import ShareIcon from "../icons/ShareIcon";
import PWASteps from "./PWASteps";

const IOSandSafariPWATip: FC = () => {
  const { t } = useTranslation();
  // macOS Safari 的選項是「加入 Dock 中」，非 iOS 的「加入主畫面」
  const { isMacSafari } = useDeviceDetect();

  return (
    <PWASteps
      steps={[
        { icon: <ShareIcon />, text: t("pwaIOSStep1") },
        {
          icon: <AddToScreenIcon />,
          text: isMacSafari ? t("pwaSafariDesktopStep2") : t("pwaStep2"),
        },
      ]}
    />
  );
};

export default IOSandSafariPWATip;
