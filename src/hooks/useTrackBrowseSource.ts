import { GaEnum } from "@/enums/GaEnum";
import { gaClickEvent } from "@/utils/GaUtils";
import { useEffect } from "react";

export function useTrackBrowseSource() {
  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      gaClickEvent(GaEnum.BROWSE_FROM_PWA);
    } else {
      gaClickEvent(GaEnum.BROWSE_FROM_WEB);
    }
  }, []);
}
