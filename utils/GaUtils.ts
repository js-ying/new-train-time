import { sendGAEvent } from "@next/third-parties/google";
import { GaEnum } from "../enums/GaEnum";

const gaClickEvent = (value: GaEnum) => {
  sendGAEvent("event", "buttonClicked", { value: value });
};

export { gaClickEvent };
