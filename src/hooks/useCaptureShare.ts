import { GaEnum } from "@/enums/GaEnum";
import { gaClickEvent } from "@/utils/GaUtils";
import { useToPng } from "@hugocxl/react-to-image";
import { useState } from "react";

interface UseCaptureShareOptions {
  selector: string;
  imageNamePrefix: string;
  gaEventName?: GaEnum;
}

export const useCaptureShare = ({
  selector,
  imageNamePrefix,
  gaEventName,
}: UseCaptureShareOptions) => {
  const [isCapturing, setIsCapturing] = useState(false);

  const [_, downloadPng] = useToPng<HTMLDivElement>({
    selector,
    quality: 0.8,
    onSuccess: async (base64Image: string) => {
      const imageName = `${imageNamePrefix}_${new Date().getTime()}`;

      if (navigator.canShare) {
        const response = await fetch(base64Image);
        const blob = await response.blob();

        const shareData = {
          files: [new File([blob], `${imageName}.png`, { type: "image/png" })],
        };

        if (navigator.canShare(shareData)) {
          try {
            await navigator.share(shareData);
          } catch (e) {
            console.error("Share failed", e);
          }
        }
      } else {
        const link = document.createElement("a");
        link.download = `${imageName}.png`;
        link.href = base64Image;
        link.click();
      }

      setIsCapturing(false);
    },
  });

  const capture = () => {
    setIsCapturing(true);
    if (gaEventName) {
      gaClickEvent(gaEventName);
    }
    // 給一點時間讓 Loading 畫面渲染，並確保 DOM 穩定
    setTimeout(() => {
      downloadPng();
    }, 1000);
  };

  return {
    isCapturing,
    capture,
  };
};
