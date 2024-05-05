import { Modal, ModalContent } from "@nextui-org/react";
import { FC } from "react";
import useDeviceDetect from "../../hooks/useDeviceDetectHook";
import IOSandSafariPWATip from "./IOSandSafariPWATip";
import NonIOSPWATip from "./NonIOSPWATip";

interface PWATipDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const PWATipDialog: FC<PWATipDialogProps> = ({ open, setOpen }) => {
  const { isIOS, isSafari } = useDeviceDetect();

  return (
    <Modal
      isOpen={open}
      onOpenChange={setOpen}
      size="md"
      classNames={{
        base: "bg-white dark:bg-neutral-700",
        header: "flex items-center justify-center gap-2",
        body: "text-center",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>{isIOS || isSafari ? <IOSandSafariPWATip /> : <NonIOSPWATip />}</>
        )}
      </ModalContent>
    </Modal>
  );
};

export default PWATipDialog;
