import { ModalBody, ModalFooter, ModalHeader } from "@nextui-org/react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { FC } from "react";

const NonIOSPWATip: FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <ModalHeader>{`${t(
        "installToDesktop",
      )} - Chrome or Android`}</ModalHeader>
      <ModalBody>
        <ol>
          <li className="mb-4">
            <div className="mb-1 text-left">＊電腦：{t("pwaChromeStep1")}</div>
            <Image
              src={`/images/pwa/pwa-chrome-tip.png`}
              alt="pwa-chrome-tip"
              width={457}
              height={83}
              className="rounded"
            />
          </li>
          <li className="text-left">
            <p>＊Android：</p>
            <p className="ml-3">1. {t("pwaChromeStep2")}</p>
            <p className="ml-3">2. {t("pwaIOSStep2")}</p>
          </li>
        </ol>
      </ModalBody>
      <ModalFooter></ModalFooter>
    </>
  );
};

export default NonIOSPWATip;
