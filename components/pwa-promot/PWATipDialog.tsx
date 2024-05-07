import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import { useTranslation } from "next-i18next";
import { FC, useState } from "react";
import AndroidPWATip from "./AndroidPWATip";
import IOSandSafariPWATip from "./IOSandSafariPWATip";
import PCPWATip from "./PCPWATip";

interface PWATipDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const PWATipDialog: FC<PWATipDialogProps> = ({ open, setOpen }) => {
  const { t } = useTranslation();
  const [tabList] = useState(["iOS", "Android", "PC"]);
  const [active, setActive] = useState("iOS");

  return (
    <Modal
      isOpen={open}
      onOpenChange={setOpen}
      size="md"
      classNames={{
        base: "bg-white dark:bg-eerieBlack-500",
        header: "flex items-center justify-center gap-2",
        body: "text-center",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="pb-2">
              {t("installToDesktopBtn")}
            </ModalHeader>
            <ModalBody className="mb-2">
              <div className="mb-2 flex justify-center gap-4">
                {tabList.map((item) => {
                  return (
                    <Button
                      className={`
                  ${
                    active === item
                      ? "bg-silverLakeBlue-500 text-white dark:bg-gamboge-500 dark:text-eerieBlack-500"
                      : "bg-neutral-500 text-white dark:bg-neutral-600"
                  }`}
                      radius="full"
                      size="sm"
                      onClick={() => setActive(item)}
                      key={item}
                    >
                      {item}
                    </Button>
                  );
                })}
              </div>

              {active === "iOS" && <IOSandSafariPWATip />}
              {active === "Android" && <AndroidPWATip />}
              {active === "PC" && <PCPWATip />}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default PWATipDialog;
