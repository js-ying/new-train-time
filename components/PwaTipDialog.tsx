import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { FC } from "react";
import useDeviceDetect from "../hooks/useDeviceDetectHook";

const ArrowDownIcon: FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      className="fade-in h-4 w-4 stroke-zinc-500 dark:stroke-zinc-400"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5"
      />
    </svg>
  );
};

const ShareIcon: FC = () => {
  return (
    <div className="flex h-8 w-12 items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        width="32"
        height="32"
        className="fill-sky-600 dark:fill-sky-400"
      >
        <g id="Layer_2">
          <path
            className="st1"
            d="M50.21 19.87H40.8a1.641 1.641 0 0 0 0 3.28h9.41c.75 0 1.36.61 1.36 1.36v31.24c0 .75-.61 1.36-1.36 1.36H13.79c-.75 0-1.36-.61-1.36-1.36V24.5c0-.75.61-1.36 1.36-1.36h9.41a1.641 1.641 0 0 0 0-3.28h-9.41c-2.56 0-4.64 2.08-4.64 4.64v31.24c0 2.56 2.08 4.64 4.64 4.64h36.42c2.56 0 4.64-2.08 4.64-4.64V24.5a4.648 4.648 0 0 0-4.64-4.63z"
          />
          <path
            className="st1"
            d="M22.8 15.2c.42 0 .84-.16 1.16-.48l6.4-6.41v31.63a1.641 1.641 0 0 0 3.28 0V8.32l6.4 6.41c.32.32.74.48 1.16.48a1.635 1.635 0 0 0 1.16-2.79l-9.19-9.19c-.33-.33-.75-.49-1.17-.49-.42 0-.84.16-1.17.48l-9.19 9.19a1.63 1.63 0 0 0 0 2.31c.33.32.74.48 1.16.48z"
          />
        </g>
      </svg>
    </div>
  );
};

const AddToScreenIcon: FC = () => {
  return (
    <div className="flex h-8 w-12 justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="55.99425507 31.98999977 157.76574707 157.76371765"
        width="26"
        height="26"
        className="fill-neutral-500"
      >
        <path d="M90.49 32.83a54.6 54.6 0 019.55-.84c23.98.03 47.96 0 71.94.01 8.5.07 17.3 1.74 24.4 6.65 10.94 7.28 16.52 20.54 17.35 33.3.06 26.03 0 52.06.03 78.08 0 10.16-3.59 20.56-10.95 27.73-7.93 7.61-18.94 11.43-29.79 11.98-25.71.03-51.42 0-77.12.01-10.37-.11-21.01-3.77-28.17-11.48-8.22-8.9-11.72-21.29-11.73-33.21.01-23.03-.03-46.05.02-69.07-.01-9.14 1.33-18.71 6.65-26.4 6.21-9.4 16.97-14.79 27.82-16.76m38.18 41.09c-.05 10.25.01 20.5 0 30.75-9.58-.03-19.16.02-28.75-.04-2.27.08-4.98-.25-6.68 1.61-2.84 2.34-2.75 7.12.01 9.48 1.8 1.69 4.46 1.57 6.75 1.64 9.56-.04 19.12-.01 28.67-.03.02 10.24-.06 20.48.01 30.72-.14 2.66 1.36 5.4 3.95 6.3 3.66 1.66 8.52-1.13 8.61-5.23.26-10.59.02-21.2.09-31.79 9.88 0 19.76.02 29.64.01 2.74.12 5.85-.67 7.14-3.34 2.23-3.75-.61-9.34-5.08-9.29-10.57-.14-21.14-.01-31.7-.04-.01-10.25.04-20.49 0-30.74.3-3.5-2.66-7.09-6.3-6.79-3.65-.33-6.66 3.26-6.36 6.78z"></path>
        <path
          className="fill-neutral-100"
          d="M128.67 73.92c-.3-3.52 2.71-7.11 6.36-6.78 3.64-.3 6.6 3.29 6.3 6.79.04 10.25-.01 20.49 0 30.74 10.56.03 21.13-.1 31.7.04 4.47-.05 7.31 5.54 5.08 9.29-1.29 2.67-4.4 3.46-7.14 3.34-9.88.01-19.76-.01-29.64-.01-.07 10.59.17 21.2-.09 31.79-.09 4.1-4.95 6.89-8.61 5.23-2.59-.9-4.09-3.64-3.95-6.3-.07-10.24.01-20.48-.01-30.72-9.55.02-19.11-.01-28.67.03-2.29-.07-4.95.05-6.75-1.64-2.76-2.36-2.85-7.14-.01-9.48 1.7-1.86 4.41-1.53 6.68-1.61 9.59.06 19.17.01 28.75.04.01-10.25-.05-20.5 0-30.75z"
        ></path>
      </svg>
    </div>
  );
};

const IOSTip: FC = () => {
  const { t } = useTranslation();
  const { isIOS } = useDeviceDetect();

  return (
    <>
      <p>{t("pwaIntro")}</p>
      <div className="mt-1 flex items-center justify-center">
        <ShareIcon /> 1. {t("pwaStep1")}
      </div>
      <div className="flex justify-center">
        <AddToScreenIcon />
        2. {t("pwaStep2")}
      </div>
      <div className="flex items-center justify-center">
        <Image
          src={`/images/logos/logo-32.png`}
          alt="traintime-logo"
          width={28}
          height={28}
          className="mx-2 rounded"
        />
        3. {t("pwaStep3")}
      </div>
      {isIOS && (
        <div className="mt-2 flex flex-col justify-center text-sm text-zinc-500 dark:text-zinc-400">
          <p className="mb-2">點擊此按鈕</p>
          <div className="flex justify-center">
            <ArrowDownIcon />
          </div>
        </div>
      )}
    </>
  );
};

interface PwaTipDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const PwaTipDialog: FC<PwaTipDialogProps> = ({ open, setOpen }) => {
  const { t } = useTranslation();
  return (
    <Modal
      isOpen={open}
      onOpenChange={setOpen}
      size="2xl"
      classNames={{
        base: "bg-white dark:bg-neutral-700",
        header: "flex items-center justify-center gap-2",
        body: "text-center",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>{t("installToDesktop")}</ModalHeader>
            <ModalBody>
              <IOSTip />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default PwaTipDialog;
