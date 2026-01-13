import { Button } from "@heroui/react";
import { useTranslation } from "next-i18next";
import { FC, useEffect, useState } from "react";
import { usePwaPrompt } from "../../contexts/PwaContext";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import PWATipDialog from "./PWATipDialog";

const PWAPromotableButton: FC = () => {
  const { t } = useTranslation();
  const deferredPrompt = usePwaPrompt();
  const [installPrompt, setInstallPrompt] = useState(deferredPrompt);

  useEffect(() => {
    if (deferredPrompt) {
      setInstallPrompt(deferredPrompt);
    }
  }, [deferredPrompt]);

  const triggerPromot = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
  };

  return (
    <>
      {installPrompt == null ? (
        <Button
          radius="full"
          size="sm"
          className="bg-neutral-500 text-white dark:bg-neutral-600"
          isDisabled={true}
        >
          {t("installedBtn")}
        </Button>
      ) : (
        <>
          <Button
            radius="full"
            size="sm"
            className="bg-neutral-500 text-white dark:bg-neutral-600"
            onPress={triggerPromot}
          >
            {t("installToDesktopBtn")}
          </Button>
        </>
      )}
    </>
  );
};

const NonPWAPromotableButton: FC = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        radius="full"
        size="sm"
        className="bg-neutral-500 text-white dark:bg-neutral-600"
        onClick={() => setOpen(true)}
      >
        {t("installToDesktopBtn")}
      </Button>
      <PWATipDialog open={open} setOpen={setOpen} />
    </>
  );
};

const PWAInstallButton: FC = () => {
  const { isPWAPromotable } = useDeviceDetect();

  return (
    <>
      {isPWAPromotable ? <PWAPromotableButton /> : <NonPWAPromotableButton />}
    </>
  );
};

export default PWAInstallButton;
