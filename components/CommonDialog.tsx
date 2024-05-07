import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useTranslation } from "next-i18next";
import { FC } from "react";

const ErrorIcon: FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-6 w-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
      />
    </svg>
  );
};

interface CommonDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  alertMsg: string;
}

const CommonDialog: FC<CommonDialogProps> = ({ open, setOpen, alertMsg }) => {
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={open}
      onOpenChange={setOpen}
      size="sm"
      classNames={{
        base: "bg-white dark:bg-eerieBlack-500",
        header: "flex items-center justify-center gap-2",
        body: "text-center",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>{t("errorAlertTitle")}</ModalHeader>
            <ModalBody>{t(alertMsg) || alertMsg}</ModalBody>
            <ModalFooter></ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CommonDialog;
