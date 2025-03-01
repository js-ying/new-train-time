import { useTranslation } from "next-i18next";
import Image from "next/image";
import { FC } from "react";

const PCPWATip: FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className="mb-1 flex gap-2 text-left">
        <Image
          src={`/images/icons/chrome-icon-144.png`}
          alt="chrome-icon"
          width={26}
          height={26}
          className="rounded"
        />
        <Image
          src={`/images/icons/edge-icon-144.png`}
          alt="edge-icon"
          width={26}
          height={26}
          className="rounded"
        />
        {`${t("pwaChromeStep1")}`}
      </div>
      <Image
        src={`/images/pwa/pwa-chrome-tip.png`}
        alt="pwa-chrome-tip"
        width={457}
        height={83}
        className="rounded"
      />
    </>
  );
};

export default PCPWATip;
