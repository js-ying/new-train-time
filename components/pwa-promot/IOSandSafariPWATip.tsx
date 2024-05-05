import { ModalBody, ModalFooter, ModalHeader } from "@nextui-org/react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { FC } from "react";
import AddToScreenIcon from "../icons/AddToScreenIcon";
import ShareIcon from "../icons/ShareIcon";

const IOSandSafariPWATip: FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <ModalHeader>{`${t("installToDesktop")} - iOS or Safari`}</ModalHeader>
      <ModalBody>
        <ol>
          <li className="mb-1 flex items-center">
            <ShareIcon />
            <div>1. {t("pwaIOSStep1")}</div>
          </li>
          <li className="mb-1 flex items-center">
            <AddToScreenIcon />
            <div>2. {t("pwaIOSStep2")}</div>
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
            <div>3. {t("installedSuccessfullyMsg")}</div>
          </li>
        </ol>
      </ModalBody>
      <ModalFooter></ModalFooter>
    </>
  );
};

export default IOSandSafariPWATip;
