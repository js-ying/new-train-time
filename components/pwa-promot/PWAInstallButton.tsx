import { Button } from "@nextui-org/react";
import { useTranslation } from "next-i18next";
import { FC, useCallback, useEffect, useState } from "react";
import useDeviceDetect from "../../hooks/useDeviceDetectHook";
import PWATipDialog from "./PWATipDialog";

const PWAPromotableButton: FC = () => {
  const { t } = useTranslation();
  const [installPrompt, setInstallPrompt] = useState(null);
  const [open, setOpen] = useState(false);

  const handleBeforeInstallPrompt = useCallback((event) => {
    event.preventDefault();
    setInstallPrompt(event);
  }, []);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const triggerPromot = async () => {
    if (!installPrompt) {
      setOpen(true);
      return;
    }
    await installPrompt.prompt();
  };

  return (
    <>
      <Button
        radius="full"
        size="sm"
        className="bg-neutral-500 text-white dark:bg-neutral-600"
        onClick={triggerPromot}
      >
        {t("installToDesktop")}
      </Button>
      <PWATipDialog open={open} setOpen={setOpen} />
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
        {t("installToDesktop")}
      </Button>
      <PWATipDialog open={open} setOpen={setOpen} />
    </>
  );
};

const PWAInstallButton: FC = () => {
  const { isIOS, isSafari } = useDeviceDetect();

  return (
    <>
      {isIOS || isSafari ? <NonPWAPromotableButton /> : <PWAPromotableButton />}
    </>
  );
};

export default PWAInstallButton;
