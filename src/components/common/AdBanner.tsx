import { GaEnum } from "@/enums/GaEnum";
import { gaClickEvent } from "@/utils/GaUtils";
import { useTranslation } from "next-i18next";
import { FC, useEffect, useState } from "react";

const BottomBanner: FC = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({});

    const timer = setTimeout(() => {
      setOpen(true);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleClose = () => {
    gaClickEvent(GaEnum.BOTTOM_AD_CLOSE);
    setOpen(false);
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 mx-auto max-w-[728px] px-4 py-2 transition-all duration-300 ease-out"
      style={{ opacity: open ? 1 : 0, zIndex: open ? 10 : -1000 }}
    >
      <div className="relative h-[72px] rounded-md border border-solid border-zinc-700 p-1 transition duration-150 ease-out dark:border-zinc-200">
        <button
          onClick={handleClose}
          className="absolute -right-3 -top-3 flex h-6 w-6 items-center justify-center rounded-full
            bg-zinc-700 text-zinc-200 shadow-md hover:text-zinc-400 dark:bg-white
            dark:text-zinc-700 dark:hover:text-zinc-500"
        >
          ✕
        </button>
        <ins
          className="adsbygoogle block h-full w-full"
          data-ad-client={process.env.NEXT_PUBLIC_AD_CLIENT}
          data-ad-slot={process.env.NEXT_PUBLIC_AD_SLOT_BOTTOM}
        ></ins>
      </div>
    </div>
  );
};

const TrainInfoBanner: FC = () => {
  const { t } = useTranslation();

  useEffect(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);

  return (
    <>
      <div
        className="relative h-[268px] rounded-md border border-solid border-zinc-700 p-2
  transition duration-150 ease-out dark:border-zinc-200 md:h-[108px]"
      >
        <ins
          className="adsbygoogle block h-full w-full"
          data-ad-client={process.env.NEXT_PUBLIC_AD_CLIENT}
          data-ad-slot={process.env.NEXT_PUBLIC_AD_SLOT_TRAIN_INFO}
        ></ins>
      </div>
      <div className="mt-1 whitespace-pre-line text-xs text-zinc-500 dark:text-zinc-400">
        {t("adMsg")}
      </div>
    </>
  );
};

interface AdBannerProps {
  mode?: "trainInfo" | "bottom";
}

const AdBanner: FC<AdBannerProps> = ({ mode = "trainInfo" }) => {
  return (
    <>
      {mode === "trainInfo" && <TrainInfoBanner />}
      {mode === "bottom" && <BottomBanner />}
    </>
  );
};

export default AdBanner;
