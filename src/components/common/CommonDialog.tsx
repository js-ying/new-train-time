import {
  Button,
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

  // 確認按鈕文字 -> 若有值則顯示確認按鈕
  confirmText?: string;
  // 確認按鈕回調
  onConfirm?: () => void;
  // 取消按鈕文字 -> 若有值則顯示取消按鈕
  cancelText?: string;

  // 是否可點擊背景關閉
  isDismissable?: boolean;
  // 是否可按 Esc 關閉
  isKeyboardDismissDisabled?: boolean;
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
      isDismissable={props.isDismissable ?? !props.enableDoNotShowAgainCheckbox}
      scrollBehavior={props.scrollBehavior || "inside"}
      isKeyboardDismissDisabled={
        props.isKeyboardDismissDisabled ?? props.enableDoNotShowAgainCheckbox
      }
      onClose={customCloseEvent}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              {t(props.title) || props.title || t("errorAlertTitle")}
            </ModalHeader>
            <ModalBody className="whitespace-pre-line">
              {props.children}
            </ModalBody>

            <ModalFooter>
              {props.enableDoNotShowAgainCheckbox && (
                <Checkbox
                  isSelected={doNotShowAgain}
                  onValueChange={setDoNotShowAgain}
                >
                  {t("doNotShowAgainMsg")}
                </Checkbox>
              )}
              <div className="flex w-full items-center justify-end gap-2">
                {props.cancelText && (
                  <Button
                    variant="light"
                    onPress={() => props.setOpen(false)}
                    className="min-w-fit"
                  >
                    {t(props.cancelText)}
                  </Button>
                )}
                {props.confirmText && (
                  <Button
                    color="primary"
                    onPress={() => {
                      props.onConfirm?.();
                      props.setOpen(false);
                    }}
                    className="min-w-fit"
                  >
                    {t(props.confirmText)}
                  </Button>
                )}
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CommonDialog;
