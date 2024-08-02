import { useTranslation } from "next-i18next";
import { FC, useEffect } from "react";

const AdBanner: FC = () => {
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
          data-ad-client="ca-pub-7992139989807299"
          data-ad-slot="1622239321"
        ></ins>
      </div>
      <div className="mt-1 whitespace-pre-line text-xs text-zinc-500 dark:text-zinc-400">
        {t("adMsg")}
      </div>
    </>
  );
};

export default AdBanner;
