import { useTranslation } from "next-i18next";
import { FC } from "react";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import AddToScreenIcon from "../icons/AddToScreenIcon";
import PWASteps from "./PWASteps";

// Firefox 的「⋮」選單鈕，與其他步驟圖示同尺寸
const MenuDotsIcon: FC = () => (
  <div className="flex h-8 w-12 items-center justify-center text-2xl font-bold text-neutral-500">
    ⋮
  </div>
);

// Firefox 安裝步驟：Windows 走網址列的工作列按鈕，Android 走選單
const FirefoxPWATip: FC = () => {
  const { t } = useTranslation();
  const { hasFirefoxTaskbarTabs } = useDeviceDetect();

  return (
    <PWASteps
      steps={
        hasFirefoxTaskbarTabs
          ? [{ icon: <AddToScreenIcon />, text: t("pwaFirefoxWindowsStep1") }]
          : [
              { icon: <MenuDotsIcon />, text: t("pwaFirefoxAndroidStep1") },
              { icon: <AddToScreenIcon />, text: t("pwaFirefoxAndroidStep2") },
            ]
      }
    />
  );
};

export default FirefoxPWATip;
