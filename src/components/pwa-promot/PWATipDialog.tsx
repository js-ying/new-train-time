import CommonAlert from "@/components/common/CommonAlert";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@/components/common/SwipeableModal";
import { useTranslation } from "next-i18next";
import { FC } from "react";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import IOSandSafariPWATip from "./IOSandSafariPWATip";

interface PWATipDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const PWATipDialog: FC<PWATipDialogProps> = ({ open, setOpen }) => {
  const { t } = useTranslation();
  const { isAppleMobile, isMacSafari, isAndroid, canPromptInstall } =
    useDeviceDetect();

  // 四個條件各排除一種安裝管道：Apple 手機 / macOS Safari /
  // Android 手機 / Chromium 原生 prompt，全都沒有才是真的裝不了（如桌機版 Firefox）
  const hasNoInstallPath =
    !isAppleMobile && !isMacSafari && !isAndroid && !canPromptInstall;

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
        {() => (
          <>
            <ModalHeader className="pb-2">
              {t("installToDesktopBtn")}
            </ModalHeader>
            <ModalBody className="mb-2">
              <div className="mb-2">{t("pwaIntro")}</div>

              {hasNoInstallPath ? (
                <CommonAlert severity="warning" className="mb-2 text-left">
                  {t("pwaUnsupportedBrowserMsg")}
                </CommonAlert>
              ) : (
                <>
                  <IOSandSafariPWATip />

                  <div className="mt-3 text-sm text-muted-foreground">
                    {t("pwaAutoInstallMsg")}
                  </div>
                </>
              )}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default PWATipDialog;
