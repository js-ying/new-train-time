import { Button } from "@heroui/react";
import { useTranslation } from "next-i18next";
import { FC, useCallback, useEffect, useState } from "react";
import useDeviceDetect from "../../hooks/useDeviceDetectHook";
import PWATipDialog from "./PWATipDialog";

const PWAPromotableButton: FC = () => {
  const { t } = useTranslation();
  const [installPrompt, setInstallPrompt] = useState(null);

  const handleBeforeInstallPrompt = useCallback((event) => {
    event.preventDefault();
    setInstallPrompt(event);
  }, []);

  const handleAfterInstallPrompt = useCallback(() => {
    setInstallPrompt(null);
  }, []);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAfterInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAfterInstallPrompt);
    };
  }, []);

  const triggerPromot = async () => {
    if (!installPrompt) {
      return;
    }
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
            onClick={triggerPromot}
          >
            {t("installToDesktopBtn")}
          </Button>
          <span className="ml-2 text-xs text-zinc-500 dark:text-zinc-400">
            {t("arcNotSupport")}
          </span>
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
