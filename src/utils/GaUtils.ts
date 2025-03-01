import { sendGAEvent } from "@next/third-parties/google";
import { GaEnum } from "../enums/GaEnum";

const gaClickEvent = (target: GaEnum) => {
  sendGAEvent("event", "jsy_click", { target: target });
};

export { gaClickEvent };
