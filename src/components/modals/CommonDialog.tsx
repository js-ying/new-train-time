import {
  Checkbox,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useTranslation } from "next-i18next";
import { FC, useState } from "react";

interface CommonDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;

  // 標題 -> 預設 "錯誤訊息"
  title?: string | "errorAlertTitle";

  // 尺寸 -> 預設 "sm"
  size?:
    | "sm"
    | "lg"
    | "md"
    | "xl"
    | "2xl"
    | "xs"
    | "3xl"
    | "4xl"
    | "5xl"
    | "full";

  // 內容對齊 -> 預設置中
  bodyTextAlign?: "text-center" | "text-left" | "text-right";

  // 捲動行為
  scrollBehavior?: "inside" | "outside";

  // 啟用 "不再顯示" checkbox -> 預設 false
  enableDoNotShowAgainCheckbox?: boolean;
}

/**
 * 通用彈窗
 */
const CommonDialog: FC<CommonDialogProps> = (props) => {
  const { t } = useTranslation();
  const [doNotShowAgain, setDoNotShowAgain] = useState(false);

  const customCloseEvent = () => {
    if (props.enableDoNotShowAgainCheckbox) {
      if (doNotShowAgain) {
        window.localStorage.setItem(`${props.children}_disabled`, "true");
      }
    }
  };

  return (
    <Modal
      isOpen={props.open}
      onOpenChange={props.setOpen}
      size={props.size || "sm"}
      classNames={{
        base: "bg-white dark:bg-eerieBlack-500",
        header: "flex items-center justify-center gap-2",
        body: props.bodyTextAlign || "text-center",
      }}
      isDismissable={!props.enableDoNotShowAgainCheckbox}
      scrollBehavior={props.scrollBehavior || "inside"}
      isKeyboardDismissDisabled={props.enableDoNotShowAgainCheckbox}
      onClose={customCloseEvent}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              {t(props.title) || props.title || t("errorAlertTitle")}
            </ModalHeader>
            <ModalBody>{props.children}</ModalBody>

            <ModalFooter>
              {props.enableDoNotShowAgainCheckbox && (
                <Checkbox
                  isSelected={doNotShowAgain}
                  onValueChange={setDoNotShowAgain}
                >
                  {t("doNotShowAgainMsg")}
                </Checkbox>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CommonDialog;
